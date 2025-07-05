"use strict";
// src/application/use-cases/SolicitudInicial/VerificarAprobacionSolicitudInicialUseCase.ts
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
/**
 * Caso de uso para verificar automáticamente la aprobación de solicitudes iniciales.
 *
 * Esta clase implementa la lógica para consultar el servicio Veraz y determinar
 * automáticamente si una solicitud inicial debe ser aprobada o rechazada
 * basándose en el score crediticio del cliente.
 */
class VerificarAprobacionSolicitudInicialUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param verazService - Puerto para servicios de Veraz
     * @param notificationService - Puerto para servicios de notificación
     */
    constructor(repository, verazService, notificationService) {
        this.repository = repository;
        this.verazService = verazService;
        this.notificationService = notificationService;
    }
    /**
     * Ejecuta la verificación automática de aprobación de una solicitud inicial.
     *
     * Este método implementa el flujo completo de verificación:
     * 1. Obtiene la solicitud inicial por ID
     * 2. Verifica que esté en estado pendiente
     * 3. Consulta el servicio Veraz con el DNI del cliente
     * 4. Actualiza el estado según la respuesta (aprobada/rechazada)
     * 5. Notifica al comerciante sobre el resultado
     *
     * @param solicitudId - ID de la solicitud inicial a verificar
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe o ocurre un error en la consulta a Veraz
     */
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
                    userId: solicitud.getComercianteId() || 0,
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
                    userId: solicitud.getComercianteId() || 0,
                    type: "error",
                    message: `Error verificando aprobación: ${errorMessage}`
                });
                throw error;
            }
        });
    }
}
exports.VerificarAprobacionSolicitudInicialUseCase = VerificarAprobacionSolicitudInicialUseCase;
