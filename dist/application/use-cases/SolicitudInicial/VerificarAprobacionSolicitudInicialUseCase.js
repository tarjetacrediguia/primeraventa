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
exports.VerificarAprobacionSolicitudInicialUseCase = void 0;
class VerificarAprobacionSolicitudInicialUseCase {
    constructor(repository, verazService, notificationService) {
        this.repository = repository;
        this.verazService = verazService;
        this.notificationService = notificationService;
    }
    execute(solicitudId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Obtener solicitud
            const solicitud = yield this.repository.getSolicitudInicialById(solicitudId);
            if (!solicitud) {
                throw new Error("Solicitud no encontrada");
            }
            // 2. Verificar si ya está aprobada/rechazada
            if (solicitud.getEstado() !== "pendiente") {
                return solicitud;
            }
            try {
                // 3. Consultar Veraz
                const estadoVeraz = yield this.verazService.checkClienteStatus(solicitud.getDniCliente());
                // 4. Actualizar estado según Veraz
                if (estadoVeraz.status === "aprobado") {
                    solicitud.setEstado("aprobada");
                }
                else {
                    solicitud.setEstado("rechazada");
                }
                // 5. Guardar cambios
                const updated = yield this.repository.updateSolicitudInicial(solicitud);
                // 6. Notificar al comerciante
                yield this.notificationService.emitNotification({
                    userId: solicitud.getComercianteId() || "admin",
                    type: "solicitud_inicial",
                    message: `Solicitud ${solicitudId} actualizada a estado: ${solicitud.getEstado()}`
                });
                return updated;
            }
            catch (error) {
                // Notificar error
                let errorMessage = "Error desconocido";
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                yield this.notificationService.emitNotification({
                    userId: solicitud.getComercianteId() || "admin",
                    type: "error",
                    message: `Error verificando aprobación: ${errorMessage}`
                });
                throw error;
            }
        });
    }
}
exports.VerificarAprobacionSolicitudInicialUseCase = VerificarAprobacionSolicitudInicialUseCase;
