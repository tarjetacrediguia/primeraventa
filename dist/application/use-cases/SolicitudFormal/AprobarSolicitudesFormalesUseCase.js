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
class AprobarSolicitudesFormalesUseCase {
    constructor(repository, notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    aprobarSolicitud(solicitudId, numeroAprobacion, numeroCuenta, comentario) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener solicitud formal
            const solicitud = yield this.repository.getSolicitudFormalById(solicitudId);
            if (!solicitud) {
                throw new Error("Solicitud formal no encontrada");
            }
            // 2. Verificar que esté en estado pendiente
            if (solicitud.getEstado() !== "pendiente") {
                throw new Error("Solo se pueden aprobar solicitudes pendientes");
            }
            // 3. Agregar comentario si existe
            if (comentario) {
                solicitud.agregarComentario(`Aprobación: ${comentario}`);
            }
            // 4. Actualizar estado
            solicitud.setEstado("aprobada");
            // 5. Guardar cambios
            const solicitudActualizada = yield this.repository.updateSolicitudFormal(solicitud);
            // 6. Notificar al cliente
            yield this.notificarCliente(solicitudActualizada, `Su solicitud formal de crédito ha sido aprobada. N° Aprobación: ${numeroAprobacion}, N° Cuenta: ${numeroCuenta}`);
            return solicitudActualizada;
        });
    }
    rechazarSolicitud(solicitudId, comentario, analistaId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener solicitud formal
            const solicitud = yield this.repository.getSolicitudFormalById(solicitudId);
            if (!solicitud) {
                throw new Error("Solicitud formal no encontrada");
            }
            // 2. Verificar que esté en estado pendiente
            if (solicitud.getEstado() !== "pendiente") {
                throw new Error("Solo se pueden rechazar solicitudes pendientes");
            }
            // 3. Validar comentario
            if (!comentario || comentario.trim().length < 10) {
                throw new Error("El comentario es obligatorio y debe tener al menos 10 caracteres");
            }
            // 4. Agregar comentario
            solicitud.agregarComentario(`Rechazo por analista ${analistaId}: ${comentario}`);
            // 5. Actualizar estado
            solicitud.setEstado("rechazada");
            // 6. Guardar cambios
            const solicitudActualizada = yield this.repository.updateSolicitudFormal(solicitud);
            // 7. Notificar al cliente
            yield this.notificarCliente(solicitudActualizada, `Su solicitud formal de crédito ha sido rechazada. Comentario: ${comentario}`);
            return solicitudActualizada;
        });
    }
    notificarCliente(solicitud, mensaje) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationService.emitNotification({
                userId: solicitud.getId(), // Referencia al cliente
                type: "solicitud_formal",
                message: mensaje
            });
        });
    }
}
exports.AprobarSolicitudesFormalesUseCase = AprobarSolicitudesFormalesUseCase;
