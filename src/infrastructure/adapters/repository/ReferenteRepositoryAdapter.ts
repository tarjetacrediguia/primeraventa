// src/infrastructure/adapters/repository/ReferenteRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Referentes
 *
 * Este archivo implementa el adaptador para el repositorio de referentes del sistema.
 * Proporciona métodos para gestionar referentes asociados a solicitudes formales.
 */
import { ReferenteRepositoryPort } from "../../../application/ports/ReferenteRepositoryPort";
import { Referente } from "../../../domain/entities/Referente";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ReferenteRepositoryAdapter implements ReferenteRepositoryPort {
    
    /**
     * Guarda un nuevo referente en la base de datos.
     * @param referente - Objeto Referente a guardar.
     * @returns Promise<Referente> - El referente guardado con su ID asignado.
     */
    async saveReferente(referente: Referente): Promise<Referente> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO referentes (nombre_completo, apellido, vinculo, telefono)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, nombre_completo, apellido, vinculo, telefono`,
                [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono()
                ]
            );

            const savedData = result.rows[0];
            return this.mapToReferente(savedData);
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene un referente por su ID.
     * @param id - ID del referente a buscar.
     * @returns Promise<Referente | null> - El referente encontrado o null si no existe.
     */
    async getReferenteById(id: number): Promise<Referente | null> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT id, nombre_completo, apellido, vinculo, telefono 
                 FROM referentes 
                 WHERE id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapToReferente(result.rows[0]);
        } finally {
            client.release();
        }
    }

    /**
     * Actualiza los datos de un referente existente.
     * @param referente - Objeto Referente con los datos actualizados.
     * @returns Promise<Referente> - El referente actualizado.
     */
    async updateReferente(referente: Referente): Promise<Referente> {
        const id = referente.getId();
        if (!id) {
            throw new Error("Referente no tiene ID; no se puede actualizar");
        }

        const client = await pool.connect();
        try {
            await client.query(
                `UPDATE referentes 
                 SET nombre_completo = $1, apellido = $2, vinculo = $3, telefono = $4
                 WHERE id = $5`,
                [
                    referente.getNombreCompleto(),
                    referente.getApellido(),
                    referente.getVinculo(),
                    referente.getTelefono(),
                    id
                ]
            );

            // Devolver el referente actualizado
            return await this.getReferenteById(id) as Referente;
        } finally {
            client.release();
        }
    }

    /**
     * Elimina un referente por su ID.
     * @param id - ID del referente a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async deleteReferente(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query(
                'DELETE FROM referentes WHERE id = $1',
                [id]
            );
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene todos los referentes del sistema.
     * @returns Promise<Referente[]> - Array de todos los referentes.
     */
    async getAllReferentes(): Promise<Referente[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT id, nombre_completo, apellido, vinculo, telefono FROM referentes'
            );
            return result.rows.map((row: any) => this.mapToReferente(row));
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene los referentes asociados a una solicitud formal.
     * @param solicitudFormalId - ID de la solicitud formal.
     * @returns Promise<Referente[]> - Array de referentes asociados a la solicitud.
     */
    async getReferentesBySolicitudFormalId(solicitudFormalId: number): Promise<Referente[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT r.id, r.nombre_completo, r.apellido, r.vinculo, r.telefono
                 FROM referentes r
                 JOIN solicitud_referente sr ON r.id = sr.referente_id
                 WHERE sr.solicitud_formal_id = $1
                 ORDER BY sr.orden`,
                [solicitudFormalId]
            );
            return result.rows.map((row: any) => this.mapToReferente(row));
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene los referentes por número de teléfono.
     * @param telefono - Teléfono del referente a buscar.
     * @returns Promise<Referente[]> - Array de referentes con ese teléfono.
     */
    async getReferentesByTelefono(telefono: string): Promise<Referente[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT id, nombre_completo, apellido, vinculo, telefono 
                 FROM referentes 
                 WHERE telefono = $1`,
                [telefono]
            );
            return result.rows.map((row: any) => this.mapToReferente(row));
        } finally {
            client.release();
        }
    }

    // Método auxiliar para mapear filas de la base de datos a objetos Referente
    private mapToReferente(row: any): Referente {
        const referente = new Referente(
            row.nombre_completo,
            row.apellido,
            row.vinculo,
            row.telefono
        );
        
        // Asignar el ID usando reflexión (alternativa segura)
        if (typeof referente['setId'] === 'function') {
            referente['setId'](row.id.toString());
        } else if (typeof referente['id'] === 'undefined') {
            // Asignación directa solo si la propiedad existe
            referente['id'] = row.id.toString();
        }
        
        return referente;
    }
}
