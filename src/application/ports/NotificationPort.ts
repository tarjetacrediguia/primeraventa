// src/application/ports/NotificationPort.ts

/**
 * MÓDULO: Puerto de Notificaciones
 *
 * Este módulo define las interfaces para el puerto de notificaciones que permite
 * gestionar el sistema de notificaciones en la aplicación.
 *
 * RESPONSABILIDADES:
 * - Gestionar la emisión de notificaciones
 * - Manejar el estado de lectura de notificaciones
 * - Proporcionar métodos de consulta de notificaciones
 * - Contar notificaciones no leídas
 */

/**
 * Interfaz que define la estructura de una notificación.
 *
 * Esta interfaz describe los campos necesarios para representar
 * una notificación en el sistema.
 */
export interface Notification {
    /** Identificador único de la notificación */
    id: number;
    /** ID del usuario destinatario de la notificación */
    userId: number;
    /** Tipo de notificación (ej: 'solicitud', 'aprobacion', 'rechazo') */
    type: string;
    /** Mensaje de la notificación */
    message: string;
    /** Indica si la notificación ha sido leída */
    read: boolean;
    /** Fecha y hora de creación de la notificación */
    createdAt: Date;
    /** Datos adicionales de la notificación (opcional) */
    metadata?: any;
}

/**
 * Puerto para operaciones de notificaciones.
 *
 * Esta interfaz define los métodos necesarios para gestionar
 * las notificaciones en el sistema.
 */
export interface NotificationPort {
    /**
     * Emite una nueva notificación para un usuario.
     *
     * @param notification - Datos de la notificación a emitir (sin id, read y createdAt)
     * @returns Promise<Notification> - Notificación emitida con datos completos
     * @throws Error si los datos son inválidos o el usuario no existe
     */
    emitNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification>;

    /**
     * Obtiene todas las notificaciones de un usuario específico.
     *
     * @param userId - ID del usuario
     * @returns Promise<Notification[]> - Listado de notificaciones del usuario
     * @throws Error si el usuario no existe
     */
    getNotificationsByUserId(userId: number): Promise<Notification[]>;

    /**
     * Elimina una notificación específica.
     *
     * @param id - ID de la notificación a eliminar
     * @returns Promise<void>
     * @throws Error si la notificación no existe
     */
    deleteNotification(id: number): Promise<void>;

    /**
     * Marca una notificación como leída.
     *
     * @param id - ID de la notificación a marcar como leída
     * @returns Promise<void>
     * @throws Error si la notificación no existe
     */
    markNotificationAsRead(id: number): Promise<void>;

    /**
     * Marca todas las notificaciones de un usuario como leídas.
     *
     * @param userId - ID del usuario
     * @returns Promise<void>
     * @throws Error si el usuario no existe
     */
    markAllNotificationsAsRead(userId: number): Promise<void>;

    /**
     * Obtiene el número de notificaciones no leídas de un usuario.
     *
     * @param userId - ID del usuario
     * @returns Promise<number> - Cantidad de notificaciones no leídas
     * @throws Error si el usuario no existe
     */
    getUnreadNotificationsCount(userId: number): Promise<number>;

    /**
     * Obtiene notificaciones de un usuario por tipo específico.
     *
     * @param userId - ID del usuario
     * @param type - Tipo de notificación a filtrar
     * @returns Promise<Notification[]> - Listado de notificaciones del tipo especificado
     * @throws Error si el usuario no existe
     */
    getNotificationsByType(userId: number, type: string): Promise<Notification[]>;
}
