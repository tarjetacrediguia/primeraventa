//src/apolication/use-cases/Notificacion/MarkNotificationAsReadUseCase.ts

/**
 * MÓDULO: Caso de Uso - Marcar Notificación como Leída
 *
 * Este módulo implementa la lógica de negocio para marcar una notificación como leída
 * por parte del usuario, permitiendo gestionar el estado de las notificaciones.
 *
 * RESPONSABILIDADES:
 * - Marcar una notificación como leída
 * - Facilitar la gestión del estado de notificaciones en el panel del usuario
 */

import { NotificationPort } from "../../../application/ports/NotificationPort";

/**
 * Caso de uso para marcar una notificación como leída.
 * 
 * Esta clase implementa la lógica para actualizar el estado de una notificación
 * específica, permitiendo al usuario gestionar su bandeja de avisos.
 */
export class MarkNotificationAsReadUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param notificationPort - Puerto para operaciones de notificaciones
     */
    constructor(private readonly notificationPort: NotificationPort) {}

    /**
     * Ejecuta la acción de marcar una notificación como leída.
     * 
     * Este método actualiza el estado de la notificación especificada a "leída".
     * 
     * @param notificationId - ID de la notificación a marcar como leída
     * @returns Promise<void> - No retorna valor
     */
    async execute(notificationId: number): Promise<void> {
        return this.notificationPort.markNotificationAsRead(notificationId);
    }
}
