"use strict";
// src/application/use-cases/SolicitudInicial/ConsultarEstadoDeSolicitudesInicialesUseCase.ts
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
/**
 * Caso de uso para consultar el estado de solicitudes iniciales de un comerciante.
 *
 * Esta clase implementa la lógica para que un comerciante pueda consultar
 * todas sus solicitudes iniciales y recibir notificaciones sobre el resultado
 * de la consulta.
 */
class ConsultarEstadoDeSolicitudesInicialesUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param notificationService - Puerto para servicios de notificación
     */
    constructor(repository, notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    /**
     * Ejecuta la consulta de solicitudes iniciales de un comerciante.
     *
     * Este método obtiene todas las solicitudes iniciales asociadas al comerciante
     * y maneja los casos especiales como la ausencia de solicitudes o errores
     * en la consulta, enviando notificaciones apropiadas en cada caso.
     *
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren consultar
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del comerciante
     * @throws Error - Si ocurre un error durante la consulta de solicitudes
     */
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
