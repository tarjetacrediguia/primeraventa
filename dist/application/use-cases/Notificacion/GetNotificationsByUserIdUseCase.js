"use strict";
//src/application/use-cases/Notificacion/GetNotificationsByUserIdUseCase.ts
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
exports.GetNotificationsByUserIdUseCase = void 0;
/**
 * Caso de uso para obtener las notificaciones de un usuario específico.
 *
 * Esta clase implementa la lógica para recuperar todas las notificaciones
 * asociadas a un usuario, permitiendo mostrar su historial de avisos y alertas.
 */
class GetNotificationsByUserIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param notificationPort - Puerto para operaciones de notificaciones
     */
    constructor(notificationPort) {
        this.notificationPort = notificationPort;
    }
    /**
     * Ejecuta la obtención de notificaciones por usuario.
     *
     * Este método retorna todas las notificaciones asociadas al usuario especificado.
     *
     * @param userId - ID del usuario cuyas notificaciones se quieren obtener
     * @returns Promise<any[]> - Array con las notificaciones del usuario
     */
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationPort.getNotificationsByUserId(userId);
        });
    }
}
exports.GetNotificationsByUserIdUseCase = GetNotificationsByUserIdUseCase;
