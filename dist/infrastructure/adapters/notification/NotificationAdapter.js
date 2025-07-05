"use strict";
/**
 * MÓDULO: Adaptador de Notificaciones
 *
 * Este archivo implementa el adaptador para la gestión de notificaciones del sistema,
 * proporcionando funcionalidades para emitir, consultar y gestionar notificaciones
 * de usuarios en tiempo real.
 *
 * Responsabilidades:
 * - Emitir nuevas notificaciones para usuarios
 * - Consultar notificaciones por usuario y tipo
 * - Marcar notificaciones como leídas
 * - Gestionar el estado de lectura de notificaciones
 * - Proporcionar conteos de notificaciones no leídas
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
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
exports.NotificationAdapter = void 0;
const Notificacion_1 = require("../../../domain/entities/Notificacion");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
/**
 * Adaptador que implementa la gestión de notificaciones del sistema.
 * Proporciona métodos para crear, consultar y gestionar notificaciones de usuarios,
 * incluyendo funcionalidades de lectura y filtrado por tipo.
 */
class NotificationAdapter {
    /**
     * Emite una nueva notificación para un usuario específico.
     * Crea un registro en la base de datos con la información de la notificación.
     *
     * @param notification - Objeto con los datos de la notificación que incluye:
     *   - userId: ID del usuario destinatario
     *   - type: Tipo de notificación
     *   - message: Mensaje de la notificación
     *   - metadata: Datos adicionales (opcional)
     * @returns Promise<Notification> - La notificación creada con su ID asignado.
     */
    emitNotification(notification) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, values);
            const row = result.rows[0];
            return this.mapRowToNotification(row);
        });
    }
    /**
     * Obtiene todas las notificaciones de un usuario específico.
     * Las notificaciones se ordenan por fecha de creación (más recientes primero).
     *
     * @param userId - ID del usuario del cual obtener las notificaciones.
     * @returns Promise<Notification[]> - Array de notificaciones del usuario.
     */
    getNotificationsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, usuario_id, tipo, mensaje, leida, fecha_creacion, detalles
            FROM notificaciones
            WHERE usuario_id = $1
            ORDER BY fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [userId]);
            return result.rows.map((row) => this.mapRowToNotification(row));
        });
    }
    /**
     * Elimina una notificación específica del sistema.
     *
     * @param id - ID de la notificación a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            DELETE FROM notificaciones
            WHERE id = $1
        `;
            yield DatabaseDonfig_1.pool.query(query, [id]);
        });
    }
    /**
     * Marca una notificación específica como leída.
     * Actualiza el estado de lectura en la base de datos.
     *
     * @param id - ID de la notificación a marcar como leída.
     * @returns Promise<void> - No retorna valor.
     * @throws Error si la notificación no existe.
     */
    markNotificationAsRead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
            UPDATE notificaciones
            SET leida = TRUE
            WHERE id = $1
        `;
                const result = yield DatabaseDonfig_1.pool.query(query, [id]);
                if (result.rowCount === 0) {
                    throw new Error(`Notificación con ID ${id} no encontrada`);
                }
            }
            catch (error) {
                console.error('Error en markNotificationAsRead:', error);
                throw new Error('Error al marcar la notificación como leída');
            }
        });
    }
    /**
     * Marca todas las notificaciones de un usuario como leídas.
     * Actualiza el estado de lectura de todas las notificaciones no leídas del usuario.
     *
     * @param userId - ID del usuario cuyas notificaciones se marcarán como leídas.
     * @returns Promise<void> - No retorna valor.
     */
    markAllNotificationsAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPDATE notificaciones
            SET leida = TRUE
            WHERE usuario_id = $1
        `;
            yield DatabaseDonfig_1.pool.query(query, [userId]);
        });
    }
    /**
     * Obtiene el conteo de notificaciones no leídas de un usuario.
     *
     * @param userId - ID del usuario del cual contar las notificaciones no leídas.
     * @returns Promise<number> - Número de notificaciones no leídas.
     */
    getUnreadNotificationsCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT COUNT(*) as count
            FROM notificaciones
            WHERE usuario_id = $1 AND leida = FALSE
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [userId]);
            return parseInt(result.rows[0].count);
        });
    }
    /**
     * Obtiene las notificaciones de un usuario filtradas por tipo específico.
     * Las notificaciones se ordenan por fecha de creación (más recientes primero).
     *
     * @param userId - ID del usuario del cual obtener las notificaciones.
     * @param type - Tipo de notificación a filtrar.
     * @returns Promise<Notification[]> - Array de notificaciones del tipo especificado.
     */
    getNotificationsByType(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, usuario_id, tipo, mensaje, leida, fecha_creacion, detalles
            FROM notificaciones
            WHERE usuario_id = $1 AND tipo = $2
            ORDER BY fecha_creacion DESC
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [userId, type]);
            return result.rows.map((row) => this.mapRowToNotification(row));
        });
    }
    /**
     * Convierte una fila de la base de datos en un objeto Notificacion.
     * Método privado utilizado internamente para mapear datos de la base de datos.
     *
     * @param row - Fila de datos de la base de datos.
     * @returns Notificacion - Objeto Notificacion mapeado.
     */
    mapRowToNotification(row) {
        return new Notificacion_1.Notificacion(row.id.toString(), row.usuario_id.toString(), row.tipo, row.mensaje, row.leida, row.fecha_creacion, row.detalles);
    }
}
exports.NotificationAdapter = NotificationAdapter;
