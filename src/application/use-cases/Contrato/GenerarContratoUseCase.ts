// src/application/use-cases/Contrato/GenerarContratoUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { PdfPort } from "../../ports/PdfPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { Contrato } from "../../../domain/entities/Contrato";
import { ClienteRepositoryAdapter } from "../../../infrastructure/adapters/repository/ClienteRepositoryAdapter";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

export class GenerarContratoUseCase {
    constructor(
        private readonly solicitudRepository: SolicitudFormalRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly notificationService: NotificationPort,
        private readonly clienteRepository: ClienteRepositoryAdapter,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort
    ) {}

    async execute(numeroSolicitud: number, usuarioId: number): Promise<Contrato> {
        try {
            // 1. Obtener solicitud formal
            const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
            console.log(`Solicitud obtenida: ${JSON.stringify(solicitud)}`);
            if (!solicitud) {
                throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
            }

            // Obtener solicitud inicial relacionada
            const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitud.getSolicitudInicialId());
            if (!solicitudInicial) {
                throw new Error(`Solicitud inicial no encontrada para ID: ${solicitud.getSolicitudInicialId()}`);
            }

            // 2. Verificar estado aprobado
            if (solicitud.getEstado() !== "aprobada") {
                await this.notificarSinPermisos(solicitud);

                // Registrar evento de error en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'contratos',
                    entidadId: 0,
                    detalles: {
                        error: "Intento de generar contrato sin aprobación",
                        solicitud_formal_id: solicitud.getId(),
                        estado_actual: solicitud.getEstado()
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                
                throw new Error("La solicitud no está aprobada, no se puede generar contrato");
            }

            console.log('clienteDNI:', solicitud.getDni());
            const cliente = await this.clienteRepository.findByDni(solicitud.getDni());
            if (!cliente) {
                throw new Error(`Cliente no encontrado para el ID: ${solicitud.getClienteId()}`);
            }

            // Verificar si ya existe un contrato para esta solicitud
            const contratosExistentes = await this.contratoRepository.getContratosBySolicitudFormalId(Number(solicitud.getId()));
            if (contratosExistentes && contratosExistentes.length > 0) {

                // Registrar evento de duplicado en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.WARNING_DUPLICADO,
                    entidadAfectada: 'contratos',
                    entidadId: contratosExistentes[0].getId(),
                    detalles: {
                        mensaje: "Intento de generar contrato duplicado",
                        solicitud_formal_id: solicitud.getId()
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                throw new Error(`Ya existe un contrato para la solicitud ${solicitud.getId()}`);
            }

            // Obtener el cliente por DNI
            const clienteDNI = solicitud.getDni();
            const clientePorDNI = await this.clienteRepository.findByDni(clienteDNI);
            if (!clientePorDNI) {
                throw new Error(`No se encontró el cliente con DNI ${clienteDNI}`);
            }

            // Calcular el monto del contrato
            const monto = 10000; // Monto fijo por ahora

            // Crear el contrato con los valores correctos
            const contrato = new Contrato(
                0, 
                new Date(), 
                monto, 
                "generado", 
                solicitud.getId(), 
                clientePorDNI.getId(), 
                solicitud.getNumeroTarjeta(), // Usar el número de tarjeta de la solicitud
                solicitud.getNumeroCuenta()   // Usar el número de cuenta de la solicitud
            );
            console.log(`Contrato generado: ${contrato}`);
            // 4. Guardar contrato
            const contratoGuardado = await this.contratoRepository.saveContrato(contrato);
            console.log(`Contrato guardado: ${JSON.stringify(contratoGuardado)}`);
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.GENERAR_CONTRATO,
                entidadAfectada: 'contratos',
                entidadId: contratoGuardado.getId(),
                detalles: {
                    monto: monto,
                    numero_tarjeta: contratoGuardado.getNumeroTarjeta(),
                    numero_cuenta: contratoGuardado.getNumeroCuenta(),
                    solicitud_formal_id: solicitud.getId()
                },
                solicitudInicialId: solicitudInicial.getId()
            });
            // 5. Vincular contrato a solicitud
            await this.solicitudRepository.vincularContrato(solicitud.getSolicitudInicialId(), contratoGuardado.getId());

            console.log(`Contrato vinculado a solicitud: ${solicitud.getId()} -> ${contratoGuardado.getId()}`);
            // 6. Generar PDF
            const pdfBuffer = await this.pdfService.generateContractPdf({
                contrato: contratoGuardado.toPlainObject(),
                solicitud: solicitud.toPlainObject()
            });
            console.log(`PDF generado para contrato: ${contratoGuardado.getId()}`);
            // 7. Notificar al solicitante
            await this.notificarContratoGenerado(solicitud, contratoGuardado, pdfBuffer);

            return contratoGuardado;
        } catch (error) {
            // Manejo de errores y notificación
            const err = error instanceof Error ? error : new Error(String(error));

            
            await this.manejarErrorGeneracion(err, numeroSolicitud);
            throw error;
        }
    }

    private async notificarSinPermisos(solicitud: SolicitudFormal): Promise<void> {
        const mensaje = "Su solicitud no ha sido aprobada, por lo tanto no puede generar un contrato. Por favor contacte al administrador.";
        await this.enviarNotificacion(solicitud, mensaje);
    }

    private async notificarContratoGenerado(
        solicitud: SolicitudFormal,
        contrato: Contrato,
        pdfBuffer: Buffer
    ): Promise<void> {
        const mensaje = `Su contrato ${contrato.getNumeroTarjeta()} ha sido generado con éxito. Monto: $${contrato.getMonto()}`;
        await this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
    }

    private async manejarErrorGeneracion(error: Error, numeroSolicitud: number): Promise<void> {
        console.error(`Error generando contrato para solicitud ${numeroSolicitud}:`, error);
        
        // Obtener solicitud para notificación de error
        const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
        if (solicitud) {
            const mensajeError = "No se pudo generar su contrato. Estamos trabajando para solucionarlo.";
            await this.enviarNotificacion(solicitud, mensajeError);
        }
    }

    private async enviarNotificacion(
        solicitud: SolicitudFormal,
        mensaje: string,
        pdf?: Buffer
    ): Promise<void> {
        // Crear notificación en el sistema
        await this.notificationService.emitNotification({
            userId: solicitud.getId(),
            type: "contrato",
            message: mensaje,
            metadata: {
                email: solicitud.getEmail(),
                telefono: solicitud.getTelefono(),
                pdf: pdf ? pdf.toString("base64") : undefined
            }
        });

        // Aquí podrías agregar envío por email/SMS si tu NotificationPort lo soporta
    }

    private calcularMontoContrato(solicitud: SolicitudFormal): number {
        // Lógica para calcular el monto del contrato basado en la solicitud
        // Esta es una implementación de ejemplo - ajusta según tu lógica de negocio
        return 10000; // Valor de ejemplo
    }

    private generarIdContrato(): string {
        return `CONTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    private generarNumeroAutorizacion(): string {
        return `AUTH-${Date.now()}`;
    }

    private generarNumeroCuenta(): string {
        return `CTA-${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    }
}