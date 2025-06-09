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
exports.ConsultarEstadoDeSolicitudesInicialesUseCase = void 0;
class ConsultarEstadoDeSolicitudesInicialesUseCase {
    constructor(repository, notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    execute(comercianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener solicitudes del comerciante
                const solicitudes = yield this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
                if (solicitudes.length === 0) {
                    // Notificar al comerciante que no hay solicitudes
                    yield this.notificationService.emitNotification({
                        userId: Number(comercianteId),
                        type: "solicitud_inicial",
                        message: "No se encontraron solicitudes iniciales para su comercio"
                    });
                    return [];
                }
                return solicitudes;
            }
            catch (error) {
                // Notificar error al comerciante
                yield this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "error",
                    message: "Error al consultar solicitudes iniciales"
                });
                if (error instanceof Error) {
                    throw new Error("Error al consultar solicitudes: " + error.message);
                }
                else {
                    throw new Error("Error al consultar solicitudes: " + String(error));
                }
            }
        });
    }
}
exports.ConsultarEstadoDeSolicitudesInicialesUseCase = ConsultarEstadoDeSolicitudesInicialesUseCase;
