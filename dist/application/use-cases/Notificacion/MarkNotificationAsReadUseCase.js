"use strict";
//src/apolication/use-cases/Notificacion/MarkNotificationAsReadUseCase.ts
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
exports.MarkNotificationAsReadUseCase = void 0;
/**
 * Caso de uso para marcar una notificación como leída.
 *
 * Esta clase implementa la lógica para actualizar el estado de una notificación
 * específica, permitiendo al usuario gestionar su bandeja de avisos.
 */
class MarkNotificationAsReadUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param notificationPort - Puerto para operaciones de notificaciones
     */
    constructor(notificationPort) {
        this.notificationPort = notificationPort;
    }
    /**
     * Ejecuta la acción de marcar una notificación como leída.
     *
     * Este método actualiza el estado de la notificación especificada a "leída".
     *
     * @param notificationId - ID de la notificación a marcar como leída
     * @returns Promise<void> - No retorna valor
     */
    execute(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationPort.markNotificationAsRead(notificationId);
        });
    }
}
exports.MarkNotificationAsReadUseCase = MarkNotificationAsReadUseCase;
