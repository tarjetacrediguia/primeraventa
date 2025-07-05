//src/application/use-cases/Notificacion/GetNotificationsByUserIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Notificaciones por Usuario
 *
 * Este módulo implementa la lógica de negocio para obtener todas las notificaciones
 * asociadas a un usuario específico en el sistema.
 *
 * RESPONSABILIDADES:
 * - Obtener todas las notificaciones de un usuario
 * - Facilitar la consulta de notificaciones para mostrar en el panel del usuario
 */

import { NotificationPort } from "../../../application/ports/NotificationPort";

/**
 * Caso de uso para obtener las notificaciones de un usuario específico.
 * 
 * Esta clase implementa la lógica para recuperar todas las notificaciones
 * asociadas a un usuario, permitiendo mostrar su historial de avisos y alertas.
 */
export class GetNotificationsByUserIdUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param notificationPort - Puerto para operaciones de notificaciones
     */
    constructor(private readonly notificationPort: NotificationPort) {}

    /**
     * Ejecuta la obtención de notificaciones por usuario.
     * 
     * Este método retorna todas las notificaciones asociadas al usuario especificado.
     * 
     * @param userId - ID del usuario cuyas notificaciones se quieren obtener
     * @returns Promise<any[]> - Array con las notificaciones del usuario
     */
    async execute(userId: number): Promise<any[]> {
        return this.notificationPort.getNotificationsByUserId(userId);
    }
}
