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
exports.AprobarSolicitudesFormalesUseCase = void 0;
const historialActions_1 = require("../../constants/historialActions");
class AprobarSolicitudesFormalesUseCase {
    constructor(repository, notificationService, historialRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.historialRepository = historialRepository;
    }
    aprobarSolicitud(solicitudId, numeroTarjeta, numeroCuenta, aprobadorId, esAdministrador, comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener solicitud formal
            const solicitud = yield this.repository.getSolicitudFormalById(solicitudId);
            const solicitudInicialId = solicitud === null || solicitud === void 0 ? void 0 : solicitud.getSolicitudInicialId();
            if (!solicitud) {
                // Registrar evento de solicitud no encontrada
                yield this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Solicitud formal no encontrada",
                        solicitudId
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Solicitud formal no encontrada");
            }
            if (esAdministrador) {
                solicitud.setAdministradorAprobadorId(aprobadorId);
            }
            else {
                solicitud.setAnalistaAprobadorId(aprobadorId);
            }
            // 2. Verificar que esté en estado pendiente
            if (solicitud.getEstado() !== "pendiente") {
                // Registrar evento de estado inválido
                yield this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Estado no pendiente",
                        estado_actual: solicitud.getEstado(),
                        estado_requerido: "pendiente"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Solo se pueden aprobar solicitudes pendientes");
            }
            // 3. Agregar comentario si existe
            if (comentario) {
                solicitud.agregarComentario(`Aprobación: ${comentario}`);
            }
            // 4. Actualizar estado
            solicitud.setEstado("aprobada");
            solicitud.setNumeroTarjeta(numeroTarjeta);
            solicitud.setNumeroCuenta(numeroCuenta);
            // 5. Guardar cambios
            const solicitudActualizada = yield this.repository.updateSolicitudFormalAprobacion(solicitud);
            // Registrar aprobación exitosa
            yield this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: historialActions_1.HISTORIAL_ACTIONS.APPROVE_SOLICITUD_FORMAL,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitudId,
                detalles: {
                    nuevo_estado: "aprobada",
                    numero_tarjeta: numeroTarjeta,
                    numero_cuenta: numeroCuenta,
                    comentario: comentario || ""
                },
                solicitudInicialId: solicitudInicialId
            });
            // 6. Notificar al cliente
            yield this.notificarCliente(solicitudActualizada, `Su solicitud formal de crédito ha sido aprobada. N° NumeroTarjeta: ${numeroTarjeta}, N° Cuenta: ${numeroCuenta}`);
            return solicitudActualizada;
        });
    }
    rechazarSolicitud(solicitudId, comentario, aprobadorId, esAdministrador) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener solicitud formal
            const solicitud = yield this.repository.getSolicitudFormalById(solicitudId);
            const solicitudInicialId = solicitud === null || solicitud === void 0 ? void 0 : solicitud.getSolicitudInicialId();
            if (!solicitud) {
                // Registrar evento de solicitud no encontrada
                yield this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Solicitud formal no encontrada",
                        solicitudId
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Solicitud formal no encontrada");
            }
            // 2. Asignar aprobador según rol
            if (esAdministrador) {
                solicitud.setAdministradorAprobadorId(aprobadorId);
            }
            else {
                solicitud.setAnalistaAprobadorId(aprobadorId);
            }
            // 3. Verificar estado pendiente
            if (solicitud.getEstado() !== "pendiente") {
                throw new Error("Solo se pueden rechazar solicitudes pendientes");
            }
            // 4. Validar comentario
            if (!comentario || comentario.trim().length < 10) {
                // Registrar evento de comentario inválido
                yield this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: historialActions_1.HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Comentario inválido",
                        comentario,
                        longitud: (comentario === null || comentario === void 0 ? void 0 : comentario.trim().length) || 0
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("El comentario es obligatorio y debe tener al menos 10 caracteres");
            }
            // 5. Agregar comentario con contexto
            const rol = esAdministrador ? 'administrador' : 'analista';
            const comentarioCompleto = `Rechazo por ${rol} ${aprobadorId}: ${comentario}`;
            solicitud.agregarComentario(comentarioCompleto);
            // 6. Actualizar estado
            solicitud.setEstado("rechazada");
            // 7. Guardar cambios usando la nueva función específica
            const solicitudActualizada = yield this.repository.updateSolicitudFormalRechazo(solicitud);
            // Registrar rechazo exitoso
            yield this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: historialActions_1.HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitudId,
                detalles: {
                    nuevo_estado: "rechazada",
                    comentario: comentarioCompleto,
                    aprobador_rol: rol
                },
                solicitudInicialId: solicitudInicialId
            });
            // 8. Notificar al cliente
            yield this.notificarCliente(solicitudActualizada, `Su solicitud formal de crédito ha sido rechazada. Comentario: ${comentario}`);
            return solicitudActualizada;
        });
    }
    notificarCliente(solicitud, mensaje) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationService.emitNotification({
                userId: solicitud.getComercianteId(), // Referencia al cliente
                type: "solicitud_formal",
                message: mensaje
            });
        });
    }
}
exports.AprobarSolicitudesFormalesUseCase = AprobarSolicitudesFormalesUseCase;
