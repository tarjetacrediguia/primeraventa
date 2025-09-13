"use strict";
// src/application/use-cases/SolicitudInicial/CrearSolicitudInicialUseCase.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearSolicitudInicialUseCase = void 0;
const SolicitudInicial_1 = require("../../../domain/entities/SolicitudInicial");
const Cliente_1 = require("../../../domain/entities/Cliente");
const historialActions_1 = require("../../constants/historialActions");
const GetDataNosisUseCase_1 = require("../Nosis/GetDataNosisUseCase");
const VerifyDataNosisUseCase_1 = require("../Nosis/VerifyDataNosisUseCase");
/**
 * Caso de uso para crear una nueva solicitud inicial de crédito.
 *
 * Esta clase implementa la lógica completa para crear una solicitud inicial,
 * incluyendo validaciones de negocio, creación de entidades y manejo de eventos.
 */
class CrearSolicitudInicialUseCase {
    /**
     * Constructor del caso de uso para crear solicitudes iniciales.
     *
     * @param solicitudInicialRepository - Puerto para operaciones de solicitudes iniciales
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param solicitudFormalRepository - Puerto para operaciones de solicitudes formales
     * @param notificationService - Puerto para servicios de notificación
     * @param clienteRepository - Puerto para operaciones de clientes
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param analistaRepository - Puerto para operaciones de analistas
     * @param nosisPort - Puerto para servicios de Nosis
     * @param nosisAutomatico - Booleano para activar modo automático de Nosis
     */
    constructor(solicitudInicialRepository, contratoRepository, solicitudFormalRepository, notificationService, clienteRepository, historialRepository, analistaRepository, nosisPort, nosisAutomatico) {
        this.solicitudInicialRepository = solicitudInicialRepository;
        this.contratoRepository = contratoRepository;
        this.solicitudFormalRepository = solicitudFormalRepository;
        this.notificationService = notificationService;
        this.clienteRepository = clienteRepository;
        this.historialRepository = historialRepository;
        this.analistaRepository = analistaRepository;
        this.nosisPort = nosisPort;
        this.nosisAutomatico = nosisAutomatico;
    }
    /**
     * Ejecuta la creación de una solicitud inicial de crédito.
     *
     * Este método implementa el flujo completo de creación de solicitud inicial:
     * 1. Busca o crea el cliente según el CUIL proporcionado
     * 2. Verifica que el cliente no tenga créditos activos
     * 3. Crea la solicitud inicial con estado pendiente
     * 4. Integra con Nosis para validación automática
     * 5. Actualiza datos del cliente con información de Nosis
     * 6. Aplica reglas de aprobación automática (si está habilitado)
     * 7. Registra eventos en el historial
     * 8. Envía notificaciones al comerciante y analistas
     *
     * INTEGRACIÓN CON NOSIS:
     * - Obtiene datos personales y laborales del cliente
     * - Actualiza información del cliente con datos de Nosis
     * - Aplica reglas de aprobación automática si nosisAutomatico está habilitado
     * - Maneja estados: aprobado, pendiente, rechazado
     *
     * VALIDACIONES REALIZADAS:
     * - Cliente no debe tener créditos activos
     * - CUIL debe ser válido
     * - Datos de Nosis deben ser procesables
     *
     * @param dniCliente - DNI del cliente para la solicitud
     * @param cuilCliente - CUIL del cliente para la solicitud
     * @param comercianteId - ID del comerciante que crea la solicitud
     * @returns Promise<CrearSolicitudInicialResponse> - Respuesta con solicitud y datos de Nosis
     * @throws Error - Si el cliente ya tiene un crédito activo o si ocurre un error en el proceso
     */
    execute(dniCliente, cuilCliente, comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                // ===== PASO 1: CREAR O RECUPERAR CLIENTE =====
                // Buscar cliente existente por CUIL o crear uno nuevo
                let cliente;
                let clienteTemporal;
                try {
                    cliente = yield this.clienteRepository.findByCuil(cuilCliente);
                }
                catch (error) {
                    // No se encontró el cliente, se creará uno nuevo
                }
                finally {
                    // Crear cliente con datos mínimos si no existe
                    cliente = new Cliente_1.Cliente(0, "Nombre temporal", "Apellido temporal", dniCliente, cuilCliente);
                    clienteTemporal = yield this.clienteRepository.save(cliente);
                }
                // ===== PASO 2: VALIDAR CRÉDITO ACTIVO =====
                // Verificar que el cliente no tenga créditos activos
                const tieneCreditoActivo = yield this.tieneCreditoActivo(cuilCliente);
                if (tieneCreditoActivo) {
                    // Notificar al comerciante que no puede crear solicitud
                    yield this.notificationService.emitNotification({
                        userId: Number(comercianteId),
                        type: "solicitud_inicial",
                        message: `El cliente con CUIL ${cuilCliente} ya tiene un crédito activo`,
                    });
                    // Registrar evento de rechazo
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                        entidadAfectada: "solicitudes_iniciales",
                        entidadId: 0, // No hay entidad aún
                        detalles: {
                            motivo: "Cliente con crédito activo",
                            dni_cliente: cuilCliente,
                        },
                        solicitudInicialId: undefined, // No hay solicitud aún
                    });
                    throw new Error("El cliente ya tiene un crédito activo");
                }
                // ===== PASO 3: CREAR SOLICITUD INICIAL =====
                // Crear solicitud inicial vinculada al cliente
                const solicitud = new SolicitudInicial_1.SolicitudInicial(0, new Date(), "pendiente", clienteTemporal.getId(), comercianteId);
                // ===== PASO 4: PERSISTIR SOLICITUD =====
                // Guardar solicitud inicial en la base de datos
                const solicitudCreada = yield this.solicitudInicialRepository.createSolicitudInicial(solicitud, clienteTemporal);
                const solicitudInicialId = solicitudCreada.getId();
                // ===== PASO 5: REGISTRAR EVENTO EN HISTORIAL =====
                // Registrar evento de creación exitosa en historial
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL,
                    entidadAfectada: "solicitudes_iniciales",
                    entidadId: solicitudCreada.getId(),
                    detalles: {
                        dni_cliente: dniCliente,
                        comerciante_id: comercianteId,
                        estado: "pendiente",
                    },
                    solicitudInicialId: solicitudInicialId,
                });
                // ===== PASO 6: INTEGRACIÓN CON NOSIS =====
                // Variables para almacenar datos de Nosis y resultados
                let nosisData;
                let motivoRechazo;
                let reglasFallidas;
                try {
                    // Obtener datos del cliente desde Nosis
                    const getNosisData = new GetDataNosisUseCase_1.GetDataNosisUseCase(this.nosisPort);
                    const nosisResponse = yield getNosisData.execute(cuilCliente);
                    // Verificar y validar datos de Nosis
                    const verifyNosis = new VerifyDataNosisUseCase_1.VerifyDataNosisUseCase();
                    const resultadoNosis = yield verifyNosis.execute(nosisResponse);
                    nosisData = resultadoNosis.personalData;
                    // ===== PASO 7: ACTUALIZAR DATOS DEL CLIENTE CON NOSIS =====
                    // Actualizar información personal del cliente con datos de Nosis
                    clienteTemporal.setNombreCompleto(nosisData && ((_a = nosisData.nombreCompleto) === null || _a === void 0 ? void 0 : _a.nombre)
                        ? nosisData.nombreCompleto.nombre
                        : "");
                    clienteTemporal.setApellido(nosisData && ((_b = nosisData.nombreCompleto) === null || _b === void 0 ? void 0 : _b.apellido)
                        ? nosisData.nombreCompleto.apellido
                        : "");
                    clienteTemporal.setDni(nosisData && ((_c = nosisData.documentacion) === null || _c === void 0 ? void 0 : _c.dni)
                        ? nosisData.documentacion.dni
                        : dniCliente);
                    clienteTemporal.setCuil(nosisData && ((_d = nosisData.documentacion) === null || _d === void 0 ? void 0 : _d.cuil)
                        ? nosisData.documentacion.cuil
                        : cuilCliente);
                    clienteTemporal.setFechaNacimiento(nosisData && ((_e = nosisData.documentacion) === null || _e === void 0 ? void 0 : _e.fechaNacimiento)
                        ? new Date(nosisData.documentacion.fechaNacimiento)
                        : null);
                    clienteTemporal.setSexo(nosisData &&
                        nosisData.documentacion &&
                        typeof nosisData.documentacion.sexo !== "undefined"
                        ? nosisData.documentacion.sexo
                        : null);
                    clienteTemporal.setCodigoPostal(nosisData && nosisData.domicilio && nosisData.domicilio.codigoPostal
                        ? nosisData.domicilio.codigoPostal
                        : null);
                    clienteTemporal.setLocalidad(nosisData && nosisData.domicilio && nosisData.domicilio.localidad
                        ? nosisData.domicilio.localidad
                        : null);
                    clienteTemporal.setProvincia(nosisData && nosisData.domicilio && nosisData.domicilio.provincia
                        ? nosisData.domicilio.provincia
                        : null);
                    clienteTemporal.setNumeroDomicilio(nosisData && nosisData.domicilio && nosisData.domicilio.numero
                        ? nosisData.domicilio.numero
                        : null);
                    clienteTemporal.setNacionalidad(nosisData && ((_f = nosisData.documentacion) === null || _f === void 0 ? void 0 : _f.nacionalidad)
                        ? nosisData.documentacion.nacionalidad
                        : null);
                    clienteTemporal.setEstadoCivil(nosisData && ((_g = nosisData.documentacion) === null || _g === void 0 ? void 0 : _g.estadoCivil)
                        ? nosisData.documentacion.estadoCivil
                        : null);
                    // Actualizar datos laborales del cliente con información de Nosis
                    if (nosisData &&
                        nosisData.datosLaborales &&
                        nosisData.datosLaborales.empleador) {
                        clienteTemporal.setEmpleadorRazonSocial(nosisData.datosLaborales.empleador.razonSocial || null);
                        clienteTemporal.setEmpleadorCuit(nosisData.datosLaborales.empleador.cuit || null);
                        clienteTemporal.setEmpleadorDomicilio(nosisData.datosLaborales.empleador.domicilio
                            ? `${nosisData.datosLaborales.empleador.domicilio.calle || ""} ${nosisData.datosLaborales.empleador.domicilio.numero || ""}`
                            : null);
                        clienteTemporal.setEmpleadorTelefono(nosisData.datosLaborales.empleador.telefono || null);
                        clienteTemporal.setEmpleadorCodigoPostal(nosisData.datosLaborales.empleador.domicilio &&
                            nosisData.datosLaborales.empleador.domicilio.codigoPostal
                            ? nosisData.datosLaborales.empleador.domicilio.codigoPostal
                            : null);
                        clienteTemporal.setEmpleadorLocalidad(nosisData.datosLaborales.empleador.domicilio &&
                            nosisData.datosLaborales.empleador.domicilio.localidad
                            ? nosisData.datosLaborales.empleador.domicilio.localidad
                            : null);
                        clienteTemporal.setEmpleadorProvincia(nosisData.datosLaborales.empleador.domicilio &&
                            nosisData.datosLaborales.empleador.domicilio.provincia
                            ? nosisData.datosLaborales.empleador.domicilio.provincia
                            : null);
                    }
                    // Persistir actualizaciones del cliente en la base de datos
                    yield this.clienteRepository.update(clienteTemporal);
                    // ===== PASO 8: APLICAR REGLAS DE APROBACIÓN AUTOMÁTICA =====
                    // Aplicar reglas de aprobación automática si está habilitado
                    if (this.nosisAutomatico) {
                        if (resultadoNosis.status === "aprobado") {
                            // Aprobar automáticamente la solicitud
                            solicitudCreada.setEstado("aprobada");
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, clienteTemporal);
                            solicitud.agregarComentario(`Aprobado: Nosis automático`);
                            yield this.historialRepository.registrarEvento({
                                usuarioId: null,
                                accion: historialActions_1.HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
                                entidadAfectada: "solicitudes_iniciales",
                                entidadId: solicitudCreada.getId(),
                                detalles: {
                                    sistema: "Nosis",
                                    score: resultadoNosis.score,
                                    motivo: resultadoNosis.motivo,
                                },
                                solicitudInicialId,
                            });
                        }
                        else if (resultadoNosis.status === "pendiente") {
                            // Mantener estado pendiente para revisión manual
                            solicitudCreada.setEstado("pendiente");
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, clienteTemporal);
                            solicitud.agregarComentario(`Pendiente: ${resultadoNosis.motivo}`);
                            yield this.historialRepository.registrarEvento({
                                usuarioId: null,
                                accion: historialActions_1.HISTORIAL_ACTIONS.PENDING_SOLICITUD_INICIAL,
                                entidadAfectada: "solicitudes_iniciales",
                                entidadId: solicitudCreada.getId(),
                                detalles: {
                                    sistema: "Nosis",
                                    score: resultadoNosis.score,
                                    motivo: resultadoNosis.motivo,
                                },
                                solicitudInicialId,
                            });
                        }
                        else if (resultadoNosis.status === "rechazado") {
                            // Rechazar automáticamente la solicitud
                            motivoRechazo = resultadoNosis.motivo;
                            reglasFallidas = resultadoNosis.reglasFallidas;
                            solicitudCreada.setEstado("rechazada");
                            solicitud.setMotivoRechazo(motivoRechazo !== null && motivoRechazo !== void 0 ? motivoRechazo : "");
                            solicitud.agregarComentario(`Rechazo: ${motivoRechazo}`);
                            // Guardar el motivo de rechazo en la solicitud
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, clienteTemporal);
                            yield this.historialRepository.registrarEvento({
                                usuarioId: null,
                                accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                                entidadAfectada: "solicitudes_iniciales",
                                entidadId: solicitudCreada.getId(),
                                detalles: {
                                    sistema: "Nosis",
                                    score: resultadoNosis.score,
                                    motivo: resultadoNosis.motivo,
                                    reglasFallidas: resultadoNosis.reglasFallidas,
                                },
                                solicitudInicialId,
                            });
                        }
                        else {
                            // Estado desconocido, mantener pendiente para revisión
                            solicitudCreada.setEstado("pendiente");
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, clienteTemporal);
                            yield this.notificarAnalistas(solicitudCreada, clienteTemporal);
                        }
                    }
                    else {
                        // ===== MODO MANUAL =====
                        // Modo manual: notificar a analistas para revisión
                        yield this.notificarAnalistas(solicitudCreada, clienteTemporal);
                    }
                }
                catch (error) {
                    // ===== MANEJO DE ERRORES DE NOSIS =====
                    // Registrar error de integración con Nosis pero continuar el proceso
                    console.error("Error obteniendo datos de Nosis:", error);
                }
                // ===== PASO 9: NOTIFICAR AL COMERCIANTE =====
                // Enviar notificación al comerciante sobre la creación exitosa
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: "Solicitud inicial creada exitosamente",
                });
                // ===== PASO 10: RETORNAR RESPUESTA =====
                // Retornar respuesta con solicitud y datos de Nosis
                return {
                    solicitud: solicitudCreada,
                    nosisData,
                    motivoRechazo,
                    reglasFallidas,
                };
            }
            catch (error) {
                // ===== MANEJO DE ERRORES GENERALES =====
                // Determinar mensaje de error apropiado
                let errorMessage = "Error desconocido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                // Notificar error al comerciante
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "error",
                    message: `Error al crear solicitud: ${errorMessage}`,
                });
                // Registrar evento de error en historial
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: "solicitudes_iniciales",
                    entidadId: 0, // No hay entidad aún
                    detalles: {
                        error: error instanceof Error ? error.message : String(error),
                        etapa: "creacion_solicitud_inicial",
                        dni_cliente: dniCliente,
                    },
                    solicitudInicialId: undefined, // No hay solicitud por error
                });
                // Re-lanzar el error para que sea manejado por el controlador
                throw error;
            }
        });
    }
    /**
     * Verifica si un cliente tiene un crédito activo basado en sus solicitudes formales y contratos.
     *
     * Este método privado consulta todas las solicitudes formales del cliente por DNI
     * y verifica si alguna tiene contratos asociados con estado "generado" (activo).
     *
     * @param   cuilCliente - CUIL del cliente a verificar
     * @returns Promise<boolean> - true si el cliente tiene un crédito activo, false en caso contrario
     */
    tieneCreditoActivo(cuilCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Usar CUIL en lugar de DNI
            const solicitudesFormales = yield this.solicitudFormalRepository.getSolicitudesFormalesByCuil(cuilCliente);
            for (const solicitud of solicitudesFormales) {
                const contratos = yield this.contratoRepository.getContratosBySolicitudFormalId(solicitud.getId());
                const tieneContratoActivo = contratos.some((contrato) => contrato.getEstado().toLowerCase() === "generado");
                if (tieneContratoActivo) {
                    return true;
                }
            }
            return false;
        });
    }
    /**
     * Notifica a todos los analistas activos sobre una nueva solicitud inicial.
     *
     * Este método envía una notificación a todos los analistas registrados en el sistema
     * para que revisen la nueva solicitud inicial creada.
     *
     * @param solicitud - La solicitud inicial que se ha creado
     */
    notificarAnalistas(solicitud, cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analistaIds = yield this.analistaRepository.obtenerIdsAnalistasActivos();
                const notificaciones = analistaIds.map((analistaId) => this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_inicial",
                    message: "Nueva solicitud inicial requiere revisión",
                    metadata: {
                        solicitudId: solicitud.getId(),
                        cuilCliente: cliente.getCuil(),
                        comercianteId: solicitud.getComercianteId(),
                        prioridad: "media",
                    },
                }));
                yield Promise.all(notificaciones);
            }
            catch (error) {
                console.error("Error notificando a analistas:", error);
                // Registrar error opcional
            }
        });
    }
}
exports.CrearSolicitudInicialUseCase = CrearSolicitudInicialUseCase;
/*
{
  "idSolicitudInicial": 1,
  "importeNeto":1500000,
  "comentarioInicial":"Solicitud creada por comerciante",
  "solicitaAmpliacionDeCredito":false,
  "datosEmpleador":{
    "razonSocialEmpleador":"Acme S.A",
    "cuitEmpleador":"123456",
    "cargoEmpleador":"cargo en la empresa",
    "sectorEmpleador": "sector en la empresa",
    "codigoPostalEmpleador":"8300",
    "localidadEmpleador":"NEUQUEN",
    "provinciaEmpleador":"NEUQUEN",
    "telefonoEmpleador":"299456789"
  },
  "cliente": {
    "nombreCompleto": "Benito",
    "apellido": "Dongato",
    "telefono": "+549555222669",
    "email": "Benito.Dongato@example.com",
    "aceptaTarjeta": true,
    "fechaNacimiento": "1985-05-15",
    "domicilio": "Calle Falsa 123, Buenos Aires",
    "sexo":"M",
    "codigoPostal":"8300",
    "localidad":"NEUQUEN",
    "provincia":"NEUQUEN",
    "numeroDomicilio":"1234",
    "barrio":"Barrio Falso",
    "recibo":"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCA




*/
