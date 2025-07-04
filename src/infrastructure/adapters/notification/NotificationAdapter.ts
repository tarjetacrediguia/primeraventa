import { NotificationPort, Notification } from "../../../application/ports/NotificationPort";
import { Notificacion } from "../../../domain/entities/Notificacion";
import { pool } from "../../config/Database/DatabaseDonfig";

export class NotificationAdapter implements NotificationPort {
    async emitNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
        const { userId, type, message, metadata } = notification;
        const query = `
            INSERT INTO notificaciones (usuario_id, tipo, mensaje, detalles)
            VALUES ($1, $2, $3, $4)
            RETURNING id, usuario_id, tipo, mensaje, leida, fecha_creacion, detalles
        `;
        const values = [
            userId, // Convertir a número
            type,
            message,
            metadata || null
        ];

        const result = await pool.query(query, values);
        const row = result.rows[0];
        return this.mapRowToNotification(row);
    }

    async getNotificationsByUserId(userId: number): Promise<Notification[]> {
        const query = `
            SELECT id, usuario_id, tipo, mensaje, leida, fecha_creacion, detalles
            FROM notificaciones
            WHERE usuario_id = $1
            ORDER BY fecha_creacion DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows.map((row: any) => this.mapRowToNotification(row));
    }

    async deleteNotification(id: number): Promise<void> {
        const query = `
            DELETE FROM notificaciones
            WHERE id = $1
        `;
        await pool.query(query, [id]);
    }

    async markNotificationAsRead(id: number): Promise<void> {
    try {
        const query = `
            UPDATE notificaciones
            SET leida = TRUE
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rowCount === 0) {
            throw new Error(`Notificación con ID ${id} no encontrada`);
        }
    } catch (error) {
        console.error('Error en markNotificationAsRead:', error);
        throw new Error('Error al marcar la notificación como leída');
    }
}

    async markAllNotificationsAsRead(userId: number): Promise<void> {
        const query = `
            UPDATE notificaciones
            SET leida = TRUE
            WHERE usuario_id = $1
        `;
        await pool.query(query, [userId]);
    }

    async getUnreadNotificationsCount(userId: number): Promise<number> {
        const query = `
            SELECT COUNT(*) as count
            FROM notificaciones
            WHERE usuario_id = $1 AND leida = FALSE
        `;
        const result = await pool.query(query, [userId]);
        return parseInt(result.rows[0].count);
    }

    async getNotificationsByType(userId: number, type: string): Promise<Notification[]> {
        const query = `
            SELECT id, usuario_id, tipo, mensaje, leida, fecha_creacion, detalles
            FROM notificaciones
            WHERE usuario_id = $1 AND tipo = $2
            ORDER BY fecha_creacion DESC
        `;
        const result = await pool.query(query, [userId, type]);
        return result.rows.map((row: any) => this.mapRowToNotification(row));
    }

    private mapRowToNotification(row: any): Notificacion {
        return new Notificacion(
            row.id.toString(),
            row.usuario_id.toString(),
            row.tipo,
            row.mensaje,
            row.leida,
            row.fecha_creacion,
            row.detalles
        );
    }
}
