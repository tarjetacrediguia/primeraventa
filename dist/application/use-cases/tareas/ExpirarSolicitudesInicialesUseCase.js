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
exports.ExpirarSolicitudesInicialesUseCase = void 0;
const historialActions_1 = require("../../constants/historialActions");
class ExpirarSolicitudesInicialesUseCase {
    constructor(solicitudInicialRepository, configuracionRepository, clienteRepository, analistaRepository, comercianteRepository, notificationService, historialRepository) {
        this.solicitudInicialRepository = solicitudInicialRepository;
        this.configuracionRepository = configuracionRepository;
        this.clienteRepository = clienteRepository;
        this.analistaRepository = analistaRepository;
        this.comercianteRepository = comercianteRepository;
        this.notificationService = notificationService;
        this.historialRepository = historialRepository;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const sistemaUserId = 0; // ID para acciones del sistema
            let solicitudesExpiradas = 0;
            try {
                // Registrar inicio del proceso
                yield this.historialRepository.registrarEvento({
                    usuarioId: sistemaUserId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.START_EXPIRACION_SOLICITUDES_INICIALES,
                    entidadAfectada: 'sistema',
                    entidadId: 0,
                    detalles: {
                        mensaje: "Inicio del proceso de expiración de solicitudes iniciales"
                    },
                    solicitudInicialId: undefined
                });
                // 1. Obtener días de expiración desde configuración
                const diasExpiracion = yield this.configuracionRepository.obtenerDiasExpiracion();
                // 2. Obtener solicitudes a expirar
                const solicitudes = yield this.solicitudInicialRepository.obtenerSolicitudesAExpirar(diasExpiracion);
                if (solicitudes.length === 0) {
                    console.log('No hay solicitudes para expirar');
                    // Registrar evento de no expiraciones
                    yield this.historialRepository.registrarEvento({
                        usuarioId: sistemaUserId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.NO_EXPIRACIONES_SOLICITUDES_INICIALES,
                        entidadAfectada: 'sistema',
                        entidadId: 0,
                        detalles: {
                            diasExpiracion,
                            mensaje: "No se encontraron solicitudes para expirar"
                        },
                        solicitudInicialId: undefined
                    });
                    return;
                }
                // 3. Procesar cada solicitud
                for (const solicitud of solicitudes) {
                    const solicitudId = solicitud.getId();
                    // Registrar inicio de expiración para esta solicitud
                    yield this.historialRepository.registrarEvento({
                        usuarioId: sistemaUserId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.START_EXPIRAR_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudId,
                        detalles: {
                            estado_actual: solicitud.getEstado(),
                            fecha_creacion: solicitud.getFechaCreacion(),
                            dias_expiracion: diasExpiracion
                        },
                        solicitudInicialId: solicitudId
                    });
                    // 3.1. Actualizar estado a expirada
                    yield this.solicitudInicialRepository.expirarSolicitud(solicitud.getId());
                    // 3.2. Obtener cliente asociado
                    const cliente = yield this.clienteRepository.findById(solicitud.getClienteId());
                    // 3.3. Notificar a todas las partes interesadas
                    yield this.notificarPartesInteresadas(cliente, solicitud);
                    solicitudesExpiradas++;
                    // Registrar expiración exitosa
                    yield this.historialRepository.registrarEvento({
                        usuarioId: sistemaUserId,
                        accion: historialActions_1.HISTORIAL_ACTIONS.EXPIRAR_SOLICITUD_INICIAL,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudId,
                        detalles: {
                            cliente_id: cliente.getId(),
                            cliente_nombre: cliente.getNombreCompleto(),
                            estado_anterior: solicitud.getEstado(),
                            estado_nuevo: "expirada"
                        },
                        solicitudInicialId: solicitudId
                    });
                }
                // Registrar finalización del proceso
                yield this.historialRepository.registrarEvento({
                    usuarioId: sistemaUserId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.FINISH_EXPIRACION_SOLICITUDES_INICIALES,
                    entidadAfectada: 'sistema',
                    entidadId: 0,
                    detalles: {
                        total_solicitudes: solicitudes.length,
                        exitosas: solicitudesExpiradas,
                        errores: solicitudes.length - solicitudesExpiradas
                    },
                    solicitudInicialId: undefined
                });
                // 4. Notificar éxito al sistema
                yield this.notificationService.emitNotification({
                    userId: 0, // Sistema
                    type: "sistema",
                    message: `Proceso de expiración completado: ${solicitudes.length} solicitudes expiradas`,
                    metadata: {
                        solicitudesExpiradas: solicitudes.map(s => s.getId())
                    }
                });
            }
            catch (error) {
                console.error('Error en ExpirarSolicitudesInicialesUseCase:', error);
                // Notificar error con más detalles
                yield this.notificationService.emitNotification({
                    userId: 0, // Sistema
                    type: "error",
                    message: "Error en proceso de expiración de solicitudes iniciales",
                    metadata: {
                        error: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined
                    }
                });
                throw error;
            }
        });
    }
    notificarPartesInteresadas(cliente, solicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const mensaje = `La solicitud inicial #${solicitud.getId()} del cliente ${cliente.getNombreCompleto()} ha expirado.`;
            const metadata = {
                solicitudId: solicitud.getId(),
                clienteId: cliente.getId(),
                clienteNombre: cliente.getNombreCompleto(),
                fechaCreacion: solicitud.getFechaCreacion()
            };
            // 1. Notificar al cliente
            yield this.notificarCliente(cliente, solicitud, mensaje, metadata);
            // 2. Notificar al comerciante asociado
            yield this.notificarComerciante(solicitud, mensaje, metadata);
            // 3. Notificar a todos los analistas
            yield this.notificarAnalistas(mensaje, metadata);
        });
    }
    notificarCliente(cliente, solicitud, mensaje, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            // Notificación en el sistema
            yield this.notificationService.emitNotification({
                userId: 0,
                type: "solicitud_inicial",
                message: mensaje,
                metadata: Object.assign(Object.assign({}, metadata), { entidad: "solicitud_inicial", accion: "expiracion" })
            });
        });
    }
    notificarComerciante(solicitud, mensaje, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comercianteId = solicitud.getComercianteId();
                if (comercianteId) {
                    // Obtener usuario del comerciante
                    const comerciante = yield this.comercianteRepository.getComercianteById(comercianteId);
                    if (comerciante) {
                        const usuarioId = comerciante.getId();
                        yield this.notificationService.emitNotification({
                            userId: usuarioId,
                            type: "solicitud_inicial",
                            message: `Solicitud inicial #${solicitud.getId()} ha expirado`
                        });
                    }
                }
            }
            catch (error) {
                console.error(`Error notificando al comerciante de la solicitud ${solicitud.getId()}:`, error);
            }
        });
    }
    notificarAnalistas(mensaje, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1. Obtener todos los IDs de analistas
                const analistaIds = yield this.analistaRepository.obtenerIdsAnalistasActivos();
                // 2. Enviar notificación individual a cada analista
                const notificaciones = analistaIds.map(analistaId => this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "solicitud_inicial",
                    message: mensaje
                }));
                yield Promise.all(notificaciones);
            }
            catch (error) {
                console.error("Error notificando a analistas:", error);
            }
        });
    }
}
exports.ExpirarSolicitudesInicialesUseCase = ExpirarSolicitudesInicialesUseCase;
