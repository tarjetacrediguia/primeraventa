// src/application/use-cases/Contrato/GenerarContratoUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { PdfPort } from "../../ports/PdfPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { Contrato } from "../../../domain/entities/Contrato";

export class GenerarContratoUseCase {
    constructor(
        private readonly solicitudRepository: SolicitudFormalRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly notificationService: NotificationPort
    ) {}

    async execute(numeroSolicitud: string): Promise<Contrato> {
        try {
            // 1. Obtener solicitud formal (asumiendo que el ID es el número de solicitud)
            const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
            if (!solicitud) {
                throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
            }

            // 2. Verificar estado aprobado
            if (solicitud.getEstado() !== "aprobada") {
                await this.notificarSinPermisos(solicitud);
                throw new Error("La solicitud no está aprobada, no se puede generar contrato");
            }

            // 3. Generar contrato (monto asumido o calculado según tu lógica de negocio)
            const monto = this.calcularMontoContrato(solicitud);
            const contrato = new Contrato(
                this.generarIdContrato(),
                new Date(),
                monto,
                "generado",
                solicitud.getId(),
                solicitud.getDni(), // Usamos DNI como identificador de cliente
                this.generarNumeroAutorizacion(),
                this.generarNumeroCuenta()
            );

            // 4. Guardar contrato
            const contratoGuardado = await this.contratoRepository.saveContrato(contrato);

            // 5. Vincular contrato a solicitud
            await this.solicitudRepository.vincularContrato(solicitud.getId(), contratoGuardado.getId());

            // 6. Generar PDF
            const pdfBuffer = await this.pdfService.generateContractPdf({
                contrato: contratoGuardado.toPlainObject(),
                solicitud: solicitud.toPlainObject()
            });

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
        const mensaje = `Su contrato ${contrato.getNumeroAutorizacion()} ha sido generado con éxito. Monto: $${contrato.getMonto()}`;
        await this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
    }

    private async manejarErrorGeneracion(error: Error, numeroSolicitud: string): Promise<void> {
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
            userId: Number(solicitud.getId()), // O usar otro identificador si es necesario
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