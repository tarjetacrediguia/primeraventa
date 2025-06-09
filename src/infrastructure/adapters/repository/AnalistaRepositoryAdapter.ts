//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts

import { AnalistaRepositoryPort } from "../../../application/ports/AnalistaRepositoryPort";
import { Analista } from "../../../domain/entities/Analista";
import { pool } from "../../config/Database/DatabaseDonfig";

export class AnalistaRepositoryAdapter implements AnalistaRepositoryPort {
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
                await this.asignarPermiso(client, usuarioId, permiso);
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
            
            // Actualizar permisos
            await client.query(
                'DELETE FROM usuario_permisos WHERE usuario_id = $1',
                [analista.getId()]
            );
            
            for (const permiso of analista.getPermisos()) {
                if (analista.getId() === undefined) {
                    throw new Error("El ID del analista es undefined.");
                }
                await this.asignarPermiso(client, analista.getId() as number, permiso);
            }
            
            await client.query('COMMIT');
            
            return analista;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
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