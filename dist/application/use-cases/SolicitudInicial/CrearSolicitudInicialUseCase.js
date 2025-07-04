"use strict";
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
class CrearSolicitudInicialUseCase {
    constructor(solicitudInicialRepository, contratoRepository, solicitudFormalRepository, verazService, notificationService, clienteRepository, historialRepository) {
        this.solicitudInicialRepository = solicitudInicialRepository;
        this.contratoRepository = contratoRepository;
        this.solicitudFormalRepository = solicitudFormalRepository;
        this.verazService = verazService;
        this.notificationService = notificationService;
        this.clienteRepository = clienteRepository;
        this.historialRepository = historialRepository;
    }
    execute(dniCliente, cuilCliente, comercianteId, reciboSueldo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cliente;
                try {
                    cliente = yield this.clienteRepository.findByDni(dniCliente);
                }
                catch (_a) {
                    // Crear con datos mínimos si no existe
                    cliente = new Cliente_1.Cliente(0, 'Nombre temporal', 'Apellido temporal', dniCliente, cuilCliente);
                    yield this.clienteRepository.save(cliente);
                }
                // 1. Verificar si el cliente tiene crédito activo
                const tieneCreditoActivo = yield this.tieneCreditoActivo(dniCliente);
                if (tieneCreditoActivo) {
                    // Notificar al comerciante que no puede crear solicitud
                    yield this.notificationService.emitNotification({
                        userId: Number(comercianteId),
                        type: "solicitud_inicial",
                        message: `El cliente con DNI ${dniCliente} ya tiene un crédito activo`
                    });
                    // Registrar evento de rechazo
                    yield this.historialRepository.registrarEvento({
                        usuarioId: comercianteId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: 0, // No hay entidad aún
                        detalles: {
                            motivo: "Cliente con crédito activo",
                            dni_cliente: dniCliente
                        },
                        solicitudInicialId: undefined // No hay solicitud aún
                    });
                    throw new Error("El cliente ya tiene un crédito activo");
                }
                // Crear solicitud vinculada al cliente
                const solicitud = new SolicitudInicial_1.SolicitudInicial(0, new Date(), "pendiente", dniCliente, cliente.getId(), cuilCliente, reciboSueldo, comercianteId);
                // 3. Guardar solicitud inicial
                const solicitudCreada = yield this.solicitudInicialRepository.createSolicitudInicial(solicitud);
                const solicitudInicialId = solicitudCreada.getId();
                console.log(`Solicitud inicial creada con ID: ${solicitudCreada.getId()}`);
                // Registrar evento de creación
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.CREATE_SOLICITUD_INICIAL,
                    entidadAfectada: 'solicitudes_iniciales',
                    entidadId: solicitudCreada.getId(),
                    detalles: {
                        dni_cliente: dniCliente,
                        comerciante_id: comercianteId,
                        estado: "pendiente"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                // VERIFICACION AUTOMÁTICA DE SOLICITUDES INICIALES POR VERAZ
                /*
                // 4. Consultar Veraz
                const estadoVeraz = await this.verazService.checkClienteStatus(dniCliente);
                console.log(`Estado Veraz para DNI ${dniCliente}:`, estadoVeraz);
                // 5. Actualizar estado según Veraz
                if (estadoVeraz.status === "aprobado") {
                    solicitudCreada.setEstado("aprobada");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                    // Registrar evento de aprobación automática
                    await this.historialRepository.registrarEvento({
                        usuarioId: null, // Sistema automático
                        accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudCreada.getId(),
                        detalles: {
                            sistema: "Veraz",
                            score: estadoVeraz.score,
                            motivo: estadoVeraz.motivo || "Aprobación automática"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                } else if(estadoVeraz.status === "rechazado"){
                    solicitudCreada.setEstado("rechazada");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                    // Registrar evento de rechazo automático
                    await this.historialRepository.registrarEvento({
                        usuarioId: null, // Sistema automático
                        accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudCreada.getId(),
                        detalles: {
                            sistema: "Veraz",
                            score: estadoVeraz.score,
                            motivo: estadoVeraz.motivo || "Rechazo automático"
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    //throw new Error("Cliente no apto para crédito según Veraz");
                } else {
                    solicitudCreada.setEstado("pendiente");
                    await this.solicitudInicialRepository.updateSolicitudInicial(solicitudCreada);
                }
    */
                // 6. Notificar al cliente (simulado)
                console.log(`Notificación enviada al cliente DNI:${dniCliente} sobre su solicitud`);
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: "Solicitud inicial creada exitosamente"
                });
                return solicitudCreada;
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
                    message: `Error al crear solicitud: ${errorMessage}`
                });
                // Registrar evento de error
                yield this.historialRepository.registrarEvento({
                    usuarioId: comercianteId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_iniciales',
                    entidadId: 0, // No hay entidad aún
                    detalles: {
                        error: error instanceof Error ? error.message : String(error),
                        etapa: "creacion_solicitud_inicial",
                        dni_cliente: dniCliente
                    },
                    solicitudInicialId: undefined // No hay solicitud por error
                });
                throw error;
            }
        });
    }
    tieneCreditoActivo(dniCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener todas las solicitudes formales del cliente por DNI
            const solicitudesFormales = yield this.solicitudFormalRepository.getSolicitudesFormalesByDni(dniCliente);
            console.log(`Solicitudes formales encontradas para DNI ${dniCliente}:`, solicitudesFormales.length);
            // Verificar cada solicitud formal para ver si tiene un contrato activo asociado
            for (const solicitud of solicitudesFormales) {
                const contratos = yield this.contratoRepository.getContratosBySolicitudFormalId(solicitud.getId());
                console.log(`Contratos encontrados para solicitud formal ID ${solicitud.getId()}:`, contratos.length);
                // Verificar si hay al menos un contrato activo para esta solicitud
                const tieneContratoActivo = contratos.some(contrato => {
                    const estado = contrato.getEstado().toLowerCase();
                    console.log(`Estado del contrato ID ${contrato.getId()}: ${estado}`);
                    return estado === "generado";
                });
                if (tieneContratoActivo) {
                    return true;
                }
            }
            return false;
        });
    }
}
exports.CrearSolicitudInicialUseCase = CrearSolicitudInicialUseCase;
