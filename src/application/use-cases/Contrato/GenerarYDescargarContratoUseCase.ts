// src/application/use-cases/Contrato/GeneracionYDescargaContratoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Generar y Descargar Contrato
 *
 * Este módulo implementa la lógica de negocio para generar y descargar contratos
 * basados en compras aprobadas. Incluye validaciones, generación de PDF,
 * registro en historial y notificaciones.
 *
 * RESPONSABILIDADES:
 * - Validar compra y solicitud formal asociada
 * - Verificar si ya existe un contrato para evitar duplicados
 * - Crear nuevo contrato con datos completos del cliente y comerciante
 * - Generar PDF del contrato con plantilla personalizada
 * - Almacenar contrato y PDF en base de datos
 * - Vincular contrato a la solicitud formal
 * - Registrar eventos en historial del sistema
 * - Notificar al cliente sobre la generación del contrato
 * - Manejar errores y excepciones del proceso
 * 
 * FLUJO PRINCIPAL:
 * 1. Validación de compra y solicitud formal
 * 2. Verificación de contrato existente
 * 3. Creación de contrato con datos completos
 * 4. Generación de PDF del contrato
 * 5. Almacenamiento en base de datos
 * 6. Vinculación a solicitud formal
 * 7. Registro en historial
 * 8. Notificación al cliente
 */

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
import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";
import { ConjuntoTasas } from "../../../domain/entities/ConjuntoTasas";

export class GeneracionYDescargaContratoUseCase {
    /**
     * Constructor del caso de uso para generar y descargar contratos
     * 
     * @param solicitudRepository - Repositorio para operaciones de solicitud formal
     * @param contratoRepository - Repositorio para operaciones de contrato
     * @param pdfService - Servicio para generación de PDFs
     * @param notificationService - Servicio para envío de notificaciones
     * @param clienteRepository - Repositorio para operaciones de cliente
     * @param historialRepository - Repositorio para registro de eventos en historial
     * @param solicitudInicialRepository - Repositorio para operaciones de solicitud inicial
     * @param comercianteRepository - Repositorio para operaciones de comerciante
     * @param compraRepository - Repositorio para operaciones de compra
     * @param tasasRepository - Repositorio para operaciones de tasas
     */
    constructor(
        private readonly solicitudRepository: SolicitudFormalRepositoryPort,
        private readonly contratoRepository: ContratoRepositoryPort,
        private readonly pdfService: PdfPort,
        private readonly notificationService: NotificationPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort,
        private readonly comercianteRepository: ComercianteRepositoryPort,
        private readonly compraRepository: CompraRepositoryPort,
        private readonly tasasRepository: TasasRepositoryPort
    ) {}

    /**
     * Ejecuta la generación y descarga de un contrato en un solo flujo.
     * 
     * Este método implementa el flujo completo de generación de contrato:
     * 1. Valida la compra y obtiene datos del cliente
     * 2. Obtiene y valida la solicitud formal asociada
     * 3. Verifica si ya existe un contrato para evitar duplicados
     * 4. Crea nuevo contrato con datos completos
     * 5. Genera PDF del contrato
     * 6. Almacena contrato y PDF en base de datos
     * 7. Vincula contrato a la solicitud formal
     * 8. Registra evento en historial
     * 9. Notifica al cliente
     * 
     * VALIDACIONES REALIZADAS:
     * - Compra debe existir y estar asociada a una solicitud formal
     * - Cliente debe existir
     * - Solicitud formal debe existir y estar aprobada
     * - No debe existir un contrato previo para la misma solicitud
     * 
     * @param compraId - ID de la compra aprobada
     * @param usuarioId - ID del usuario que genera el contrato
     * @returns Promise<{ pdf: Buffer }> - PDF del contrato generado
     * @throws Error - Si no se cumplen las validaciones o ocurre un error
     */
    async execute(compraId: number, usuarioId: number): Promise<{pdf: Buffer }> {
        // ===== PASO 1: VALIDAR COMPRA Y OBTENER DATOS =====
        // Obtener compra asociada por ID
        const compra = await this.compraRepository.getCompraById(compraId);

        // Verificar que la compra existe
        if (!compra) {
            throw new Error(`No se encontró compra: ${compraId}`);
        }

        // Obtener ID de solicitud formal asociada
        const numeroSolicitud = compra?.getSolicitudFormalId();

        // Verificar que la compra está asociada a una solicitud formal
        if (!numeroSolicitud) {
            throw new Error(`La compra ${compraId} no está asociada a una solicitud formal.`);
        }

        // Obtener datos del cliente asociado a la compra
        const cliente = await this.clienteRepository.findById(compra?.getClienteId());

        try {
            // ===== PASO 2: OBTENER Y VALIDAR SOLICITUD FORMAL =====
            // Obtener y validar la solicitud formal asociada
            const { solicitudFormal, solicitudInicial } = await this.obtenerYValidarSolicitud(numeroSolicitud, usuarioId);
            
            // ===== PASO 3: VERIFICAR CONTRATO EXISTENTE =====
            // Verificar si ya existe un contrato para esta solicitud para evitar duplicados
            const contratosExistentes = await this.contratoRepository.getContratosBySolicitudFormalId(Number(solicitudFormal.getId()));
            if (contratosExistentes && contratosExistentes.length > 0) {
                // Si existe un contrato, obtener el PDF existente
                const contratoExistente = contratosExistentes[0];
                const contratoCompleto = await this.contratoRepository.getContratoById(contratoExistente.getId().toString());
                if (!contratoCompleto) {
                    throw new Error(`Contrato no encontrado por ID: ${contratoExistente.getId()}`);
                }
                const pdfBuffer = contratoCompleto.getPdfContrato();
                if (!pdfBuffer) {
                    throw new Error(`El contrato no tiene PDF adjunto: ${contratoExistente.getId()}`);
                }
                // Retornar PDF existente sin crear nuevo contrato
                return { pdf: pdfBuffer };
            }

            // ===== PASO 4: CREAR NUEVO CONTRATO =====
            // Crear y guardar nuevo contrato con todos los datos necesarios
            const contrato = await this.crearYGuardarContrato(solicitudFormal, solicitudInicial, usuarioId, compra, cliente);
            
            // ===== PASO 5: GENERAR PDF DEL CONTRATO =====
            // Generar PDF del contrato usando el servicio de PDF
            const pdfBuffer = await this.pdfService.generateContractPdf({
                contrato: contrato,
                solicitudFormal: solicitudFormal,
                solicitudInicial: solicitudInicial,
            });
            
            // ===== PASO 6: ALMACENAR PDF EN EL CONTRATO =====
            // Asociar el PDF generado al contrato y guardarlo
            contrato.setPdfContrato(pdfBuffer);
            await this.contratoRepository.saveContrato(contrato);
            
            // ===== PASO 7: VINCULAR CONTRATO A SOLICITUD =====
            // Establecer la relación entre el contrato y la solicitud inicial
            await this.solicitudRepository.vincularContrato(solicitudFormal.getSolicitudInicialId(), contrato.getId());
            
            // ===== PASO 8: NOTIFICAR AL CLIENTE =====
            // Enviar notificación al cliente sobre la generación del contrato
            await this.notificarContratoGenerado(solicitudFormal, contrato, pdfBuffer);
            
            // Retornar el PDF del contrato generado
            return { pdf: pdfBuffer };
        } catch (error) {
            // ===== MANEJO DE ERRORES =====
            // Manejar errores durante la generación del contrato
            await this.manejarErrorGeneracion(error, numeroSolicitud);
            throw error;
        }
    }

    /**
     * Obtiene y valida la solicitud formal y solicitud inicial asociadas.
     * 
     * Este método privado se encarga de:
     * - Buscar la solicitud formal por ID
     * - Verificar que el cliente asociado existe
     * - Obtener la solicitud inicial relacionada
     * - Validar que la solicitud formal esté en estado "aprobada"
     * - Registrar errores en historial si es necesario
     * 
     * @param numeroSolicitud - ID de la solicitud formal
     * @param usuarioId - ID del usuario que solicita la operación
     * @returns Promise<{ solicitudFormal: SolicitudFormal, solicitudInicial: SolicitudInicial }>
     * @throws Error - Si no se encuentra la solicitud o no está aprobada
     */
    private async obtenerYValidarSolicitud(numeroSolicitud: number, usuarioId: number): Promise<{ 
        solicitudFormal: SolicitudFormal, 
        solicitudInicial: SolicitudInicial 
    }> {
        // Buscar solicitud formal por ID
        const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
        if (!solicitud) {
            throw new Error(`Solicitud formal no encontrada: ${numeroSolicitud}`);
        }
        
        // Verificar que el cliente asociado existe
        const clienteExistente = await this.clienteRepository.findById(solicitud.getClienteId());
        if (!clienteExistente) {
            throw new Error(`Cliente no encontrado para ID: ${solicitud.getClienteId()}`);
        }

        // Obtener solicitud inicial asociada
        const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitud.getSolicitudInicialId());
        if (!solicitudInicial) {
            throw new Error(`Solicitud inicial no encontrada para ID: ${solicitud.getSolicitudInicialId()}`);
        }

        // Verificar que la solicitud formal esté aprobada
        if (solicitud.getEstado() !== "aprobada") {
            // Notificar al cliente sobre la falta de permisos
            await this.notificarSinPermisos(solicitud);
            
            // Registrar error en historial
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

    /**
     * Crea y guarda un nuevo contrato con todos los datos necesarios.
     * 
     * Este método privado se encarga de:
     * - Obtener las tasas aplicables del sistema
     * - Crear una nueva instancia de Contrato
     * - Asignar datos bancarios de la compra
     * - Asignar datos del cliente y comerciante
     * - Asignar datos de referentes personales
     * - Asignar datos laborales del cliente
     * - Asignar tasas de interés y comisiones
     * - Guardar el contrato en base de datos
     * - Registrar evento en historial
     * 
     * @param solicitud - Solicitud formal asociada
     * @param solicitudInicial - Solicitud inicial asociada
     * @param usuarioId - ID del usuario que crea el contrato
     * @param compra - Compra asociada
     * @param cliente - Cliente asociado
     * @returns Promise<Contrato> - Contrato creado y guardado
     */
    private async crearYGuardarContrato(solicitud: SolicitudFormal, solicitudInicial: SolicitudInicial, usuarioId: number, compra: Compra, cliente: Cliente): Promise<Contrato> {
        // ===== OBTENER TASAS DEL SISTEMA =====
        // Obtener conjunto de tasas aplicables (ID 1 por defecto)
        const tasasResult = await this.tasasRepository.findConjuntoTasasById(1);
        if (!tasasResult) {
            throw new Error("No se encontró el conjunto de tasas con ID 1.");
        }
        const tasas: ConjuntoTasas = tasasResult;
        
        // ===== CREAR INSTANCIA DE CONTRATO =====
        // Crear nueva instancia de contrato con datos básicos
        const contrato = new Contrato(
            0, // ID temporal, se asignará al guardar
            new Date(), // Fecha de creación
            "generado", // Estado inicial
            solicitud.getId(), // ID de solicitud formal
            solicitud.getClienteId() // ID de cliente
        );
        
        // ===== ASIGNAR DATOS BANCARIOS =====
        // Asignar número de autorización y cuenta de la compra
        contrato.setNumeroAutorizacion(compra.getNumeroAutorizacion() || "AUTORIZACION-123456");
        contrato.setNumeroCuenta(compra.getNumeroCuenta() || "CUENTA-123456");
        
        // ===== ASIGNAR DATOS BÁSICOS DEL CLIENTE =====
        // Asignar datos personales del cliente
        contrato.clienteCuitOcuil = cliente.getCuil();
        contrato.clienteDni = cliente.getDni() || ""; // Usar valor por defecto si no existe
        contrato.setMonto(compra.getMontoTotal());


        // ===== OBTENER DATOS DEL COMERCIANTE =====
        // Obtener datos del comerciante asociado a la solicitud
        const comerciante = await this.comercianteRepository.getComercianteById(solicitud.getComercianteId());
        if (!comerciante) {
            throw new Error(`Comerciante no encontrado para ID: ${solicitud.getComercianteId()}`);
        }

        // Obtener referentes personales de la solicitud
        const referentes = solicitud.getReferentes();

        // ===== ASIGNAR DATOS DEL COMERCIO =====
        // Asignar información del comerciante al contrato
        contrato.comercioNombre = comerciante.getNombreComercio();
        contrato.comercioFecha = this.getCurrentLocalDate();
        contrato.comercioNAutorizacion = compra.getNumeroAutorizacion(); // Número de autorización de la compra
        contrato.comercioProducto = "Primera Venta";
        contrato.comercioSucursal = "";
        
        // ===== ASIGNAR DATOS PERSONALES DEL CLIENTE =====
        // Asignar información personal completa del cliente
        contrato.clienteNombreCompleto = cliente.getNombreCompleto();
        contrato.clienteSexo = cliente.getSexo() ?? undefined; 
        contrato.clienteCuitOcuil = cliente.getCuil();
        contrato.clienteTipoDocumento = "DNI";
        contrato.clienteDni = cliente.getDni();
        contrato.clienteFechaNacimiento = cliente.getFechaNacimiento() ? cliente.getFechaNacimiento()!.toISOString().split('T')[0] : "";
        contrato.clienteEstadoCivil = ""; 
        contrato.clienteNacionalidad = "";
        contrato.clienteSueldoNeto = solicitud.getImporteNeto().toString();
        
        // ===== ASIGNAR REFERENTES PERSONALES =====
        // Obtener los primeros dos referentes personales (máximo 2)
        const referencia1 = referentes[0] || {};
        const referencia2 = referentes[1] || {};
        
        // ===== ASIGNAR DATOS DE DOMICILIO DEL CLIENTE =====
        // Asignar información de domicilio del cliente
        contrato.clienteDomicilioCalle = cliente.getDomicilio() + " " + (cliente.getNumeroDomicilio() ?? "");
        contrato.clienteDomicilioNumero = cliente.getNumeroDomicilio() ?? undefined;
        contrato.clienteDomicilioPiso = "";
        contrato.clienteDomicilioDepartamento = "";
        contrato.clienteDomicilioLocalidad = cliente.getLocalidad() ?? "Localidad Ejemplo";
        contrato.clienteDomicilioProvincia = cliente.getProvincia() ?? "Provincia Ejemplo";
        contrato.clienteDomicilioBarrio = cliente.getBarrio() ?? "Barrio Ejemplo";
        contrato.clienteDomicilioPais = "Argentina";
        contrato.clienteDomicilioCodigoPostal = cliente.getCodigoPostal() ?? "0000";
        contrato.clienteDomicilioCorreoElectronico = cliente.getEmail() ?? undefined;
        contrato.clienteDomicilioTelefonoFijo = "";
        contrato.clienteDomicilioTelefonoCelular = solicitud.getTelefono();
        
        // ===== ASIGNAR DATOS LABORALES DEL CLIENTE =====
        // Asignar información laboral del cliente obtenida de la solicitud
        contrato.clienteDatosLaboralesActividad = "";
        contrato.clienteDatosLaboralesRazonSocial = solicitud.getRazonSocialEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesCuit = solicitud.getCuitEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesInicioActividades = "";
        contrato.clienteDatosLaboralesCargo = solicitud.getCargoEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesSector = solicitud.getSectorEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesDomicilioLegal = "";
        contrato.clienteDatosLaboralesCodigoPostal = solicitud.getCodigoPostalEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesLocalidad = solicitud.getLocalidadEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesProvincia = solicitud.getProvinciaEmpleador() ?? undefined;
        contrato.clienteDatosLaboralesTelefono = solicitud.getTelefonoEmpleador() ?? undefined;
        
        // ===== ASIGNAR DATOS DE REFERENTES PERSONALES =====
        // Asignar información de los referentes personales
        contrato.clienteReferente1Nombre = referencia1.getNombreCompleto() || '';
        contrato.clienteReferente1Apellido = referencia1.getApellido() || '';
        contrato.clienteReferente1Vinculo = referencia1.getVinculo() || '';
        contrato.clienteReferente1Telefono = referencia1.getTelefono() || '';

        contrato.clienteReferente2Nombre = referencia2.getNombreCompleto() || '';
        contrato.clienteReferente2Apellido = referencia2.getApellido() || '';
        contrato.clienteReferente2Vinculo = referencia2.getVinculo() || '';
        contrato.clienteReferente2Telefono = referencia2.getTelefono() || '';
        
        // ===== ASIGNAR TASAS DE INTERÉS Y COMISIONES =====
        // Asignar tasas Gold (nivel básico)
        contrato.tasasTeaCtfFinanciacion = tasas.obtenerTasa("TEA_INTERES_FINANCIERO_GOLD");
        contrato.tasasTnaCompensatoriosFinanciacion = tasas.obtenerTasa("TNA_INTERES_FINANCIERO_GOLD");
        contrato.tasasTnaPunitorios = tasas.obtenerTasa("TNA_INTERESES_PUNITORIOS_GOLD");
        contrato.tasasCtfFinanciacion = tasas.obtenerTasa("CFT_FINANCIACION_GOLD");
        contrato.tasasComisionRenovacionAnual = tasas.obtenerTasa("COMISION_RENOVACION_ANUAL_GOLD");
        contrato.tasasComisionMantenimiento = tasas.obtenerTasa("COMISION_MANTENIMIENTO_CUENTA_GOLD");
        contrato.tasasComisionReposicionPlastico = tasas.obtenerTasa("COMISION_REPOSICION_PLASTICO_GOLD");
        contrato.tasasAtraso05_31Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_05_31_DIAS_GOLD");
        contrato.tasasAtraso32_60Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_32_60_DIAS_GOLD");
        contrato.tasasAtraso61_90Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_61_90_DIAS_GOLD");
        contrato.tasasPagoFacil = tasas.obtenerTasa("CARGO_COBRANZA_ELECTRONICA_PAGOFACIL_GOLD");
        
        // Asignar tasas Platinium (nivel premium)
        contrato.tasasPlatiniumTeaCtfFinanciacion = tasas.obtenerTasa("TEA_INTERES_FINANCIERO_PLATINIUM");
        contrato.tasasPlatiniumTnaCompensatoriosFinanciacion = tasas.obtenerTasa("TNA_INTERES_FINANCIERO_PLATINIUM");
        contrato.tasasPlatiniumTnaPunitorios = tasas.obtenerTasa("TNA_INTERESES_PUNITORIOS_PLATINIUM");
        contrato.tasasPlatiniumCtfFinanciacion = tasas.obtenerTasa("CFT_FINANCIACION_PLATINIUM");
        contrato.tasasPlatiniumComisionRenovacionAnual = tasas.obtenerTasa("COMISION_RENOVACION_ANUAL_PLATINIUM");
        contrato.tasasPlatiniumComisionMantenimiento = tasas.obtenerTasa("COMISION_MANTENIMIENTO_CUENTA_PLATINIUM");
        contrato.tasasPlatiniumComisionReposicionPlastico = tasas.obtenerTasa("COMISION_REPOSICION_PLASTICO_PLATINIUM");
        contrato.tasasPlatiniumAtraso05_31Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_05_31_DIAS_PLATINIUM");
        contrato.tasasPlatiniumAtraso32_60Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_32_60_DIAS_PLATINIUM");
        contrato.tasasPlatiniumAtraso61_90Dias = tasas.obtenerTasa("CARGO_GESTION_COBRANZA_61_90_DIAS_PLATINIUM");
        contrato.tasasPlatiniumPagoFacil = tasas.obtenerTasa("CARGO_COBRANZA_ELECTRONICA_PAGOFACIL_PLATINIUM");  

        // ===== GUARDAR CONTRATO EN BASE DE DATOS =====
        // Persistir el contrato creado en la base de datos
        const contratoGuardado = await this.contratoRepository.saveContrato(contrato);

        // ===== REGISTRAR EVENTO EN HISTORIAL =====
        // Registrar la generación del contrato en el historial del sistema
        await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.GENERAR_CONTRATO,
            entidadAfectada: 'contratos',
            entidadId: contratoGuardado.getId(),
            detalles: {
                numero_tarjeta: contratoGuardado.getNumeroAutorizacion(),
                numero_cuenta: contratoGuardado.getNumeroCuenta(),
                solicitud_formal_id: solicitud.getId()
            },
            solicitudInicialId: solicitudInicial.getId()
        });

        // Retornar el contrato guardado
        return contratoGuardado;
    }

    /**
     * Registra un error en el historial del sistema.
     * 
     * @param usuarioId - ID del usuario que generó el error
     * @param solicitudInicialId - ID de la solicitud inicial asociada
     * @param error - Mensaje de error a registrar
     * @param solicitud - Solicitud formal relacionada
     */
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

    /**
     * Registra un intento de duplicado en el historial del sistema.
     * 
     * @param usuarioId - ID del usuario que intentó duplicar
     * @param solicitudInicialId - ID de la solicitud inicial asociada
     * @param contratoId - ID del contrato duplicado
     * @param solicitud - Solicitud formal relacionada
     */
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

    /**
 * Obtiene la fecha actual en formato YYYY-MM-DD en la zona horaria local
 * @returns Fecha actual en formato YYYY-MM-DD
 */
private getCurrentLocalDate(): string {
    const now = new Date();
    // Ajustar por la diferencia de zona horaria para obtener la fecha local correcta
    const offset = now.getTimezoneOffset() * 60000; // offset en milisegundos
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
}

/**
 * Formatea una fecha a YYYY-MM-DD en la zona horaria local
 * @param date - Fecha a formatear
 * @returns Fecha formateada en formato YYYY-MM-DD
 */
private formatDateToLocalYYYYMMDD(date: Date): string {
    if (!date) return "";
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
}

    /**
     * Notifica al cliente que no tiene permisos para generar contrato.
     * 
     * @param solicitud - Solicitud formal del cliente
     */
    private async notificarSinPermisos(solicitud: SolicitudFormal): Promise<void> {
        const mensaje = "Su solicitud no ha sido aprobada, por lo tanto no puede generar un contrato. Por favor contacte al administrador.";
        await this.enviarNotificacion(solicitud, mensaje);
    }

    /**
     * Notifica al cliente que su contrato ha sido generado exitosamente.
     * 
     * @param solicitud - Solicitud formal del cliente
     * @param contrato - Contrato generado
     * @param pdfBuffer - PDF del contrato generado
     */
    private async notificarContratoGenerado(
        solicitud: SolicitudFormal,
        contrato: Contrato,
        pdfBuffer: Buffer
    ): Promise<void> {
        const mensaje = `Su contrato ${contrato.getNumeroAutorizacion()} ha sido generado con éxito.`;
        await this.enviarNotificacion(solicitud, mensaje, pdfBuffer);
    }

    /**
     * Maneja errores durante la generación del contrato.
     * 
     * @param error - Error ocurrido durante la generación
     * @param numeroSolicitud - ID de la solicitud formal
     */
    private async manejarErrorGeneracion(error: unknown, numeroSolicitud: number): Promise<void> {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`Error generando contrato para solicitud ${numeroSolicitud}:`, err);
        
        // Intentar notificar al cliente sobre el error
        const solicitud = await this.solicitudRepository.getSolicitudFormalById(numeroSolicitud);
        if (solicitud) {
            const mensajeError = "No se pudo generar su contrato. Estamos trabajando para solucionarlo.";
            await this.enviarNotificacion(solicitud, mensajeError);
        }
    }

    /**
     * Envía una notificación al cliente a través del servicio de notificaciones.
     * 
     * @param solicitud - Solicitud formal del cliente
     * @param mensaje - Mensaje a enviar
     * @param pdf - PDF opcional a incluir en la notificación
     */
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