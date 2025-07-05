//src/infrastructure/adapters/repository/HistorialRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Historial
 *
 * Este archivo implementa el adaptador para el repositorio de historial del sistema.
 * Proporciona métodos para registrar y consultar eventos del historial de acciones.
 */

import { HistorialRepositoryPort } from "../../../application/ports/HistorialRepositoryPort";
import { Historial } from "../../../domain/entities/Historial";
import { pool } from "../../config/Database/DatabaseDonfig";

export class HistorialRepositoryAdapter implements HistorialRepositoryPort {
    /**
     * Registra un nuevo evento en el historial del sistema.
     * @param historialData - Datos del evento a registrar (sin ID ni fecha).
     * @returns Promise<Historial> - El evento registrado con su ID y fecha asignados.
     * @throws Error si hay un problema al registrar el evento.
     */
    async registrarEvento(historialData: Omit<Historial, 'id' | 'fechaHora' | 'toPlainObject'>): Promise<Historial> {
        const { usuarioId, accion, entidadAfectada, entidadId, solicitudInicialId, detalles } = historialData;
        const query = `
            INSERT INTO historial (usuario_id, accion, entidad_afectada, entidad_id, solicitud_inicial_id, detalles)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, usuario_id, accion, entidad_afectada, entidad_id, detalles, solicitud_inicial_id, fecha_hora
        `;
        const values = [usuarioId, accion, entidadAfectada, entidadId, solicitudInicialId, detalles];
        
        try {
            const result = await pool.query(query, values);
            const row = result.rows[0];
            return new Historial(
                row.id,
                row.usuario_id,
                row.accion,
                row.entidad_afectada,
                row.entidad_id,
                row.detalles,
                row.fecha_hora,
                row.solicitudInicialId !== undefined ? row.solicitudInicialId : undefined
            );
        } catch (error) {
            console.error("Error registrando evento en historial:", error);
            throw new Error("Error al registrar evento en historial");
        }
    }

    /**
     * Obtiene el historial de eventos de una solicitud inicial específica.
     * @param solicitudInicialId - ID de la solicitud inicial.
     * @returns Promise<Historial[]> - Array de eventos del historial ordenados por fecha.
     */
    async obtenerPorSolicitudInicial(solicitudInicialId: number): Promise<Historial[]> {
        const query = `
            SELECT * FROM historial 
        WHERE solicitud_inicial_id = $1
        ORDER BY fecha_hora ASC
        `;
        const result = await pool.query(query, [solicitudInicialId]);
        return result.rows.map(row => new Historial(
            row.id,
            row.usuario_id,
            row.accion,
            row.entidad_afectada,
            row.entidad_id,
            row.detalles,
            row.fecha_hora,
            row.solicitud_inicial_id !== undefined ? row.solicitud_inicial_id : undefined
        ));
    }
}
