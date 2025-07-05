//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Analistas
 *
 * Este archivo implementa el adaptador para el repositorio de analistas.
 * Proporciona métodos para interactuar con la base de datos PostgreSQL
 * y gestionar las operaciones CRUD de analistas.
 */

import { AnalistaRepositoryPort } from "../../../application/ports/AnalistaRepositoryPort";
import { Analista } from "../../../domain/entities/Analista";
import { pool } from "../../config/Database/DatabaseDonfig";

export class AnalistaRepositoryAdapter implements AnalistaRepositoryPort {
    /**
     * Obtiene los IDs de todos los analistas activos.
     * @returns Promise<number[]> - Array de IDs de analistas activos.
     */
    async obtenerIdsAnalistasActivos(): Promise<number[]> {
        const query = `
            SELECT id 
            FROM usuarios 
            WHERE rol = 'analista' 
              AND activo = true
        `;
        const result = await pool.query(query);
        return result.rows.map(row => row.id);
    }
    /**
     * Busca un analista por su email.
     * @param email - Email del analista a buscar.
     * @returns Promise<Analista | null> - El analista encontrado o null si no existe.
     */
    async findByEmail(email: string): Promise<Analista | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN analistas a ON u.id = a.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.email = $1 AND u.rol = 'analista'
            GROUP BY u.id
        `;
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToAnalista(result.rows[0]);
    }

    /**
     * Guarda un nuevo analista en la base de datos.
     * @param analista - Objeto Analista a guardar.
     * @returns Promise<Analista> - El analista guardado con su ID asignado.
     */
    async saveAnalista(analista: Analista): Promise<Analista> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Insertar en la tabla usuarios
            const usuarioQuery = `
                INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, rol, activo)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `;
            const usuarioValues = [
                analista.getNombre(),
                analista.getApellido(),
                analista.getEmail(),
                analista.getPassword(),
                analista.getTelefono(),
                'analista',
                true
            ];
            
            const usuarioRes = await client.query(usuarioQuery, usuarioValues);
            const usuarioId = usuarioRes.rows[0].id;
            
            // Insertar en la tabla analistas
            const analistaQuery = `
                INSERT INTO analistas (usuario_id)
                VALUES ($1)
            `;
            await client.query(analistaQuery, [usuarioId]);
            
            // Insertar permisos
            for (const permiso of analista.getPermisos()) {
                await this.asignarPermiso(client, usuarioId, permiso.getNombre());
            }
            
            await client.query('COMMIT');
            
            // Retornar el analista creado con su ID
            return new Analista(
                usuarioId,
                analista.getNombre(),
                analista.getApellido(),
                analista.getEmail(),
                analista.getPassword(),
                analista.getTelefono(),
                analista.getPermisos()
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    /**
     * Obtiene un analista por su ID.
     * @param id - ID del analista a buscar.
     * @returns Promise<Analista | null> - El analista encontrado o null si no existe.
     */
    async getAnalistaById(id: number): Promise<Analista | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN analistas a ON u.id = a.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.id = $1
            GROUP BY u.id
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToAnalista(result.rows[0]);
    }
    
    /**
     * Actualiza los datos de un analista existente.
     * @param analista - Objeto Analista con los datos actualizados.
     * @returns Promise<Analista> - El analista actualizado.
     */
    async updateAnalista(analista: Analista): Promise<Analista> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Actualizar datos básicos en usuarios
            const updateUserQuery = `
                UPDATE usuarios
                SET nombre = $1, apellido = $2, email = $3, telefono = $4
                WHERE id = $5
            `;
            await client.query(updateUserQuery, [
                analista.getNombre(),
                analista.getApellido(),
                analista.getEmail(),
                analista.getTelefono(),
                analista.getId()
            ]);
            
            await client.query('COMMIT');
            
            return analista;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    /**
     * Elimina un analista por su ID.
     * @param id - ID del analista a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async deleteAnalista(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Eliminar permisos primero por restricciones de clave foránea
            await client.query(
                'DELETE FROM usuario_permisos WHERE usuario_id = $1',
                [id]
            );
            
            // Eliminar de analistas
            await client.query(
                'DELETE FROM analistas WHERE usuario_id = $1',
                [id]
            );
            
            // Finalmente eliminar de usuarios
            await client.query(
                'DELETE FROM usuarios WHERE id = $1',
                [id]
            );
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    /**
     * Obtiene todos los analistas del sistema.
     * @returns Promise<Analista[]> - Array de analistas con sus permisos.
     */
    async getAllAnalistas(): Promise<Analista[]> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN analistas a ON u.id = a.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.rol = 'analista'
            GROUP BY u.id
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToAnalista(row));
    }

    private async asignarPermiso(client: any, usuarioId: number, permisoNombre: string): Promise<void> {
        // Obtener ID del permiso
        const permisoRes = await client.query('SELECT id FROM permisos WHERE nombre = $1', [permisoNombre]);
        if (permisoRes.rows.length === 0) {
            throw new Error(`Permiso '${permisoNombre}' no encontrado`);
        }
        const permisoId = permisoRes.rows[0].id;
        
        // Asignar permiso al usuario
        await client.query(`
            INSERT INTO usuario_permisos (usuario_id, permiso_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [usuarioId, permisoId]);
    }

    private mapRowToAnalista(row: any): Analista {
        return new Analista(
            Number(row.id),
            row.nombre,
            row.apellido,
            row.email,
            '', // La contraseña no se retorna en las consultas
            row.telefono,
            row.permisos.filter((p: string | null) => p !== null)
        );
    }
}
