/**
 * MÓDULO: Caso de Uso - Marcar Todas las Notificaciones como Leídas
 *
 * Este módulo implementa la lógica de negocio para marcar todas las notificaciones
 * de un usuario como leídas, permitiendo gestionar el estado de las notificaciones
 * en lote.
 *
 * RESPONSABILIDADES:
 * - Marcar todas las notificaciones de un usuario como leídas
 * - Facilitar la gestión del estado de notificaciones en el panel del usuario
 */

import { NotificationPort } from "../../../application/ports/NotificationPort";

/**
 * Caso de uso para marcar todas las notificaciones de un usuario como leídas.
 * 
 * Esta clase implementa la lógica para actualizar el estado de todas las notificaciones
 * de un usuario a "leídas", permitiendo al usuario limpiar su bandeja de avisos.
 */
export class MarkAllNotificationsAsReadUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param notificationPort - Puerto para operaciones de notificaciones
     */
    constructor(private readonly notificationPort: NotificationPort) {}

    /**
     * Ejecuta la acción de marcar todas las notificaciones como leídas.
     * 
     * Este método actualiza el estado de todas las notificaciones del usuario a "leídas".
     * 
     * @param userId - ID del usuario cuyas notificaciones se marcarán como leídas
     * @returns Promise<void> - No retorna valor
     */
    async execute(userId: number): Promise<void> {
        return this.notificationPort.markAllNotificationsAsRead(userId);
    }
}