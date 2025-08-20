// src/application/use-cases/Contrato/GeneracionYDescargaContratoUseCase.ts

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { ContratoRepositoryPort } from "../../ports/ContratoRepositoryPort";
import { PdfPort } from "../../ports/PdfPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { Contrato } from "../../../domain/entities/Contrato";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { Compra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { Cliente } from "../../../domain/entities/Cliente";

export class GeneracionYDescargaContratoUseCase {
    constructor(
        private readonly solicitudRepository: SolicitudFormalRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly notificationService: NotificationPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
        private readonly comercianteRepository: ComercianteRepositoryPort,
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    /**
     * Ejecuta la generación y descarga de un contrato en un solo flujo
     * 
     * @param numeroSolicitud - ID de la solicitud formal aprobada
     * @param usuarioId - ID del usuario que genera el contrato
     * @returns Promise<{ contrato: Contrato, pdf: Buffer }> - Contrato generado y PDF del contrato
     */
    async execute(compraId: number, usuarioId: number): Promise<{pdf: Buffer }> {
        // Obtener compra asociada
        const compra = await this.compraRepository.getCompraById(compraId)

        

        const numeroSolicitud = compra?.getSolicitudFormalId();

        if (!compra) {
            throw new Error(`No se encontró compra: ${compraId}`);
        }
        const cliente = await this.clienteRepository.findById(compra?.getClienteId());

        if (!numeroSolicitud) {
            throw new Error(`La compra ${compraId} no está asociada a una solicitud formal.`);
        }

        try {
            // 1. Obtener y validar solicitud formal
            const { solicitudFormal, solicitudInicial } = await this.obtenerYValidarSolicitud(numeroSolicitud, usuarioId);
            
            // 2. Verificar si ya existe un contrato para esta solicitud
            const contratosExistentes = await this.contratoRepository.getContratosBySolicitudFormalId(Number(solicitudFormal.getId()));
            if (contratosExistentes && contratosExistentes.length > 0) {
                const contratoExistente = contratosExistentes[0];
                const contratoCompleto = await this.contratoRepository.getContratoById(contratoExistente.getId().toString());
                if (!contratoCompleto) {
                    throw new Error(`Contrato no encontrado por ID: ${contratoExistente.getId()}`);
                }
                const pdfBuffer = contratoCompleto.getPdfContrato();
                if (!pdfBuffer) {
                    throw new Error(`El contrato no tiene PDF adjunto: ${contratoExistente.getId()}`);
                }
                return { pdf: pdfBuffer };
            }

            // 3. Crear y guardar contrato (solo si no existe)
            const contrato = await this.crearYGuardarContrato(solicitudFormal,solicitudInicial, usuarioId,compra,cliente);
            //console.log(`Contrato creado: ${JSON.stringify(contrato.toPlainObject())}`);
            //console.log(`solicitud: ${JSON.stringify(solicitud.toPlainObject())}`);
            console.log(contrato)
            // 4. Generar PDF
            const pdfBuffer = await this.pdfService.generateContractPdf({
                contrato: contrato,
                solicitudFormal: solicitudFormal,
                solicitudInicial: solicitudInicial,
            });
            
            // 5. Almacenar PDF en el contrato
            contrato.setPdfContrato(pdfBuffer);
            await this.contratoRepository.saveContrato(contrato);
            
            // 6. Vincular contrato a solicitud
            await this.solicitudRepository.vincularContrato(solicitudFormal.getSolicitudInicialId(), contrato.getId());
            
            // 7. Notificar al solicitante
            await this.notificarContratoGenerado(solicitudFormal, contrato, pdfBuffer);
            
            return { pdf: pdfBuffer };
        } catch (error) {
            await this.manejarErrorGeneracion(error, numeroSolicitud);
            throw error;
        }
    }

    private async obtenerYValidarSolicitud(numeroSolicitud: number, usuarioId: number): Promise<{ 
  solicitudFormal: SolicitudFormal, 
  solicitudInicial: SolicitudInicial 
}> {
        const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
        if (!solicitud) {
            throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
        }
        console.log(`Solicitud formal encontrada: ${solicitud}`);
        // Añadir esta verificación
        const clienteExistente = await this.clienteRepository.findById(solicitud.getClienteId());
        if (!clienteExistente) {
            throw new Error(`Cliente no encontrado para ID: ${solicitud.getClienteId()}`);
        }

        const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitud.getSolicitudInicialId());
        if (!solicitudInicial) {
            throw new Error(`Solicitud inicial no encontrada para ID: ${solicitud.getSolicitudInicialId()}`);
        }

        if (solicitud.getEstado() !== "aprobada") {
            await this.notificarSinPermisos(solicitud);
            await this.registrarErrorHistorial(
                usuarioId, 
                solicitudInicial.getId(),
                "Intento de generar contrato sin aprobación",
                solicitud
            );
            throw new Error("La solicitud no está aprobada, no se puede generar contrato");
        }

        return { 
    solicitudFormal: solicitud, 
    solicitudInicial 
  };
    }

    private async crearYGuardarContrato(solicitud: SolicitudFormal,solicitudInicial: SolicitudInicial, usuarioId: number, compra:Compra,cliente:Cliente): Promise<Contrato> {


        const contrato = new Contrato(
            0, 
            new Date(),
            "generado", 
            solicitud.getId(), 
            solicitud.getClienteId()
        );
        contrato.setNumeroTarjeta(compra.getNumeroTarjeta() || "TARJETA-123456");
        contrato.setNumeroCuenta(compra.getNumeroCuenta() || "CUENTA-123456");
        contrato.clienteCuitOcuil = cliente.getCuil();
        contrato.clienteDni = cliente.getDni() || ""; // Usar valor por defecto si no existe
        contrato.setMonto(compra.getMontoTotalPonderado());


        // Obtener datos del comerciante
        const comerciante = await this.comercianteRepository.getComercianteById(solicitud.getComercianteId());
        if (!comerciante) {
            throw new Error(`Comerciante no encontrado para ID: ${solicitud.getComercianteId()}`);
        }

        // Obtener referentes
        const referentes = solicitud.getReferentes();

        // Asignar datos desanidados al contrato
        contrato.comercioNombre = comerciante.getNombreComercio();
        contrato.comercioFecha = new Date().toISOString().split('T')[0];
        contrato.comercioNAutorizacion = "AUT-123456"; 
        contrato.comercioProducto = "Préstamo Personal";
        contrato.comercioSucursal = "Sucursal Central";
        
        contrato.clienteNombreCompleto = cliente.getNombreCompleto();
        contrato.clienteSexo = "Masculino"; // Ejemplo
        contrato.clienteCuitOcuil = cliente.getCuil();
        contrato.clienteTipoDocumento = "DNI";
        contrato.clienteDni = cliente.getDni();
        contrato.clienteFechaNacimiento = cliente.getFechaNacimiento() ? cliente.getFechaNacimiento()!.toISOString().split('T')[0] : "";
        contrato.clienteEstadoCivil = "Soltero"; // Ejemplo
        contrato.clienteNacionalidad = "Argentina"; // Ejemplo
        
        // Referencias personales (tomamos los primeros dos referentes)
        // Nota: Solo almacenamos en contrato, no en BD directamente
        const referencia1 = referentes[0] || {};
        const referencia2 = referentes[1] || {};
        
        contrato.clienteDomicilioCalle = cliente.getDomicilio() ? cliente.getDomicilio()!.split(',')[0] : "";
        contrato.clienteDomicilioNumero = "123"; // Ejemplo
        contrato.clienteDomicilioPiso = "1";
        contrato.clienteDomicilioDepartamento = "A";
        contrato.clienteDomicilioLocalidad = "Ciudad Ejemplo";
        contrato.clienteDomicilioProvincia = "Provincia Ejemplo";
        contrato.clienteDomicilioBarrio = "Barrio Ejemplo";
        contrato.clienteDomicilioPais = "Argentina";
        contrato.clienteDomicilioCodigoPostal = "1234";
        contrato.clienteDomicilioCorreoElectronico = cliente.getEmail() ?? undefined;
        contrato.clienteDomicilioTelefonoFijo = "";
        contrato.clienteDomicilioTelefonoCelular = solicitud.getTelefono();
        
        contrato.clienteDatosLaboralesActividad = "Empleado";
        contrato.clienteDatosLaboralesRazonSocial = cliente.getDatosEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesCuit = "20-12345678-9";
        contrato.clienteDatosLaboralesInicioActividades = "2020-01-01";
        contrato.clienteDatosLaboralesCargo = "Analista";
        contrato.clienteDatosLaboralesSector = "Tecnología";
        contrato.clienteDatosLaboralesDomicilioLegal = "Calle Legal 456";
        contrato.clienteDatosLaboralesCodigoPostal = "5678";
        contrato.clienteDatosLaboralesLocalidad = "Ciudad Legal";
        contrato.clienteDatosLaboralesProvincia = "Provincia Legal";
        contrato.clienteDatosLaboralesTelefono = "987654321";
        
        // Tasas (valores de ejemplo) actualizar según las tasas reales
        contrato.tasasTeaCtfFinanciacion = 84.4;
        contrato.tasasTnaCompensatoriosFinanciacion = 62.78;
        contrato.tasasTnaPunitorios = 31.39;
        contrato.tasasCtfFinanciacion = 84.4;
        contrato.tasasComisionRenovacionAnual = 3300;
        contrato.tasasComisionMantenimiento = 650;
        contrato.tasasComisionReposicionPlastico = 1026;
        contrato.tasasAtraso05_31Dias = 380;
        contrato.tasasAtraso32_60Dias = 649;
        contrato.tasasAtraso61_90Dias = 742;
        contrato.tasasPagoFacil = 99;
        contrato.tasasPlatiniumTeaCtfFinanciacion = 84.4;
        contrato.tasasPlatiniumTnaCompensatoriosFinanciacion = 62.78;
        contrato.tasasPlatiniumTnaPunitorios = 31.39;
        contrato.tasasPlatiniumCtfFinanciacion = 84.4;
        contrato.tasasPlatiniumComisionRenovacionAnual = 3300;
        contrato.tasasPlatiniumComisionMantenimiento = 650;
        contrato.tasasPlatiniumComisionReposicionPlastico = 1026;
        contrato.tasasPlatiniumAtraso05_31Dias = 380;
        contrato.tasasPlatiniumAtraso32_60Dias = 649;
        contrato.tasasPlatiniumAtraso61_90Dias = 742;
        contrato.tasasPlatiniumPagoFacil = 99;

        //guardar el contrato en la base de datos
        const contratoGuardado = await this.contratoRepository.saveContrato(contrato);

        
        
        await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.GENERAR_CONTRATO,
            entidadAfectada: 'contratos',
            entidadId: contratoGuardado.getId(),
            detalles: {
                numero_tarjeta: contratoGuardado.getNumeroTarjeta(),
                numero_cuenta: contratoGuardado.getNumeroCuenta(),
                solicitud_formal_id: solicitud.getId()
            },
            solicitudInicialId: solicitudInicial.getId()
        });

        return contratoGuardado;
    }

    private async registrarErrorHistorial(
        usuarioId: number,
        solicitudInicialId: number,
        error: string,
        solicitud: SolicitudFormal
    ): Promise<void> {
        await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: 'contratos',
            entidadId: 0,
            detalles: {
                error: error,
                solicitud_formal_id: solicitud.getId(),
                estado_actual: solicitud.getEstado()
            },
            solicitudInicialId: solicitudInicialId
        });
    }

    private async registrarDuplicadoHistorial(
        usuarioId: number,
        solicitudInicialId: number,
        contratoId: number,
        solicitud: SolicitudFormal
    ): Promise<void> {
        await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.WARNING_DUPLICADO,
            entidadAfectada: 'contratos',
            entidadId: contratoId,
            detalles: {
                mensaje: "Intento de generar contrato duplicado",
                solicitud_formal_id: solicitud.getId()
            },
            solicitudInicialId: solicitudInicialId
        });
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
        const mensaje = `Su contrato ${contrato.getNumeroTarjeta()} ha sido generado con éxito.}`;
        await this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
    }

    private async manejarErrorGeneracion(error: unknown, numeroSolicitud: number): Promise<void> {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`Error generando contrato para solicitud ${numeroSolicitud}:`, err);
        
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
    }
}