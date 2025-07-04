"use strict";
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
class NotificationAdapter {
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
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            DELETE FROM notificaciones
            WHERE id = $1
        `;
            yield DatabaseDonfig_1.pool.query(query, [id]);
        });
    }
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
    mapRowToNotification(row) {
        return new Notificacion_1.Notificacion(row.id.toString(), row.usuario_id.toString(), row.tipo, row.mensaje, row.leida, row.fecha_creacion, row.detalles);
    }
}
exports.NotificationAdapter = NotificationAdapter;
