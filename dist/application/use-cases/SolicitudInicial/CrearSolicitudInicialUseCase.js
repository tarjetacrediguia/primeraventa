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
     * Constructor del caso de uso.
     *
     * @param solicitudInicialRepository - Puerto para operaciones de solicitudes iniciales
     * @param contratoRepository - Puerto para operaciones de contratos
     * @param solicitudFormalRepository - Puerto para operaciones de solicitudes formales
     * @param verazService - Puerto para servicios de Veraz (actualmente deshabilitado)
     * @param notificationService - Puerto para servicios de notificación
     * @param clienteRepository - Puerto para operaciones de clientes
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param analistaRepository - Puerto para operaciones de analistas
     * @param verazAutomatico - Booleano para activar modo automático de Veraz
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
     * 1. Busca o crea el cliente según el DNI proporcionado
     * 2. Verifica que el cliente no tenga créditos activos
     * 3. Crea la solicitud inicial con estado pendiente
     * 4. Registra el evento en el historial
     * 5. Envía notificaciones al comerciante
     *
     * @param dniCliente - DNI del cliente para la solicitud
     * @param cuilCliente - CUIL del cliente para la solicitud
     * @param comercianteId - ID del comerciante que crea la solicitud
     * @param reciboSueldo - Buffer opcional con el recibo de sueldo del cliente
     * @returns Promise<SolicitudInicial> - La solicitud inicial creada
     * @throws Error - Si el cliente ya tiene un crédito activo o si ocurre un error en el proceso
     */
    execute(dniCliente, cuilCliente, comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cliente;
                try {
                    cliente = yield this.clienteRepository.findByCuil(cuilCliente);
                }
                catch (_a) {
                    // Crear con datos mínimos si no existe
                    cliente = new Cliente_1.Cliente(0, "Nombre temporal", "Apellido temporal", dniCliente, cuilCliente);
                    yield this.clienteRepository.save(cliente);
                }
                // 1. Verificar si el cliente tiene crédito activo
                const tieneCreditoActivo = yield this.tieneCreditoActivo(cuilCliente); // Usar CUIL en lugar de DNI
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
                // Crear solicitud vinculada al cliente
                const solicitud = new SolicitudInicial_1.SolicitudInicial(0, new Date(), "pendiente", cliente.getId(), comercianteId);
                // 3. Guardar solicitud inicial
                const solicitudCreada = yield this.solicitudInicialRepository.createSolicitudInicial(solicitud, cliente);
                const solicitudInicialId = solicitudCreada.getId();
                // Registrar evento de creación
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
                let nosisData;
                let motivoRechazo;
                let reglasFallidas;
                try {
                    const getNosisData = new GetDataNosisUseCase_1.GetDataNosisUseCase(this.nosisPort);
                    const nosisResponse = yield getNosisData.execute(cuilCliente);
                    const verifyNosis = new VerifyDataNosisUseCase_1.VerifyDataNosisUseCase();
                    const resultadoNosis = yield verifyNosis.execute(nosisResponse);
                    nosisData = resultadoNosis.personalData;
                    cliente.setSexo(nosisData && nosisData.documentacion && typeof nosisData.documentacion.sexo !== "undefined" ? nosisData.documentacion.sexo : null);
                    cliente.setCodigoPostal(nosisData && nosisData.domicilio && nosisData.domicilio.codigoPostal ? nosisData.domicilio.codigoPostal : null);
                    cliente.setLocalidad(nosisData && nosisData.domicilio && nosisData.domicilio.localidad ? nosisData.domicilio.localidad : null);
                    cliente.setProvincia(nosisData && nosisData.domicilio && nosisData.domicilio.provincia ? nosisData.domicilio.provincia : null);
                    cliente.setNumeroDomicilio(nosisData && nosisData.domicilio && nosisData.domicilio.numero ? nosisData.domicilio.numero : null);
                    //TODO: guardar la razon social del empleador en la solicitud formal
                    //TODO: guardar el cuit del empleador en la solicitud formal
                    //TODO: guardar datos del empleador en la solicitud formal
                    //TODO: guardar en la BD los datos del cliente
                    //TODO : actualizar el cliente con los datos obtenidos de Nosis
                    //TODO: actualizar la solicitud formal con los datos del empleador
                    console.log("Actualizando cliente con datos de Nosis:", cliente);
                    if (this.nosisAutomatico) {
                        const getNosisData = new GetDataNosisUseCase_1.GetDataNosisUseCase(this.nosisPort);
                        const nosisData = yield getNosisData.execute(cuilCliente);
                        const verifyNosis = new VerifyDataNosisUseCase_1.VerifyDataNosisUseCase();
                        const resultadoNosis = yield verifyNosis.execute(nosisData);
                        if (resultadoNosis.status === "aprobado") {
                            solicitudCreada.setEstado("aprobada");
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, cliente);
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
                        else if (resultadoNosis.status === "rechazado") {
                            motivoRechazo = resultadoNosis.motivo;
                            reglasFallidas = resultadoNosis.reglasFallidas;
                            solicitudCreada.setEstado("rechazada");
                            solicitud.setMotivoRechazo(motivoRechazo !== null && motivoRechazo !== void 0 ? motivoRechazo : "");
                            solicitud.agregarComentario(`Rechazo: ${motivoRechazo}`);
                            //se guarda el motivo de rechazo en la solicitud
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, cliente);
                            yield this.historialRepository.registrarEvento({
                                usuarioId: null,
                                accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                                entidadAfectada: "solicitudes_iniciales",
                                entidadId: solicitudCreada.getId(),
                                detalles: {
                                    sistema: "Nosis",
                                    score: resultadoNosis.score,
                                    motivo: resultadoNosis.motivo,
                                    reglasFallidas: resultadoNosis.reglasFallidas
                                },
                                solicitudInicialId,
                            });
                        }
                        else {
                            solicitudCreada.setEstado("pendiente");
                            yield this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada, cliente);
                            yield this.notificarAnalistas(solicitudCreada, cliente);
                        }
                    }
                    else {
                        // Modo manual
                        yield this.notificarAnalistas(solicitudCreada, cliente);
                    }
                }
                catch (error) {
                    console.error("Error obteniendo datos de Nosis:", error);
                }
                // Notificación al comerciante (existente)
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: "Solicitud inicial creada exitosamente",
                });
                return {
                    solicitud: solicitudCreada,
                    nosisData,
                    motivoRechazo,
                    reglasFallidas
                };
            }
            catch (error) {
                // Notificar error al comerciante
                let errorMessage = "Error desconocido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "error",
                    message: `Error al crear solicitud: ${errorMessage}`,
                });
                // Registrar evento de error
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
