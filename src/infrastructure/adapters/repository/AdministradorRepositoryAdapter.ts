//src/infrastructure/adapters/repository/AdministradorRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Administradores
 *
 * Este archivo implementa el adaptador para el repositorio de administradores.
 * Proporciona métodos para interactuar con la base de datos PostgreSQL
 * y gestionar las operaciones CRUD de administradores.
 */

import { AdministradorRepositoryPort } from "../../../application/ports/AdministradorRepositoryPort";
import { Administrador } from "../../../domain/entities/Administrador";
import { pool } from "../../config/Database/DatabaseDonfig";

export class AdministradorRepositoryAdapter implements AdministradorRepositoryPort {
    /**
     * Obtiene todos los administradores del sistema.
     * @returns Promise<Administrador[]> - Array de administradores con sus permisos.
     */
    async getAllAdministradores(): Promise<Administrador[]> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN administradores a ON u.id = a.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.rol = 'administrador'
            GROUP BY u.id
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToAdministrador(row));
    }
    /**
     * Guarda un nuevo administrador en la base de datos.
     * @param administrador - Objeto Administrador a guardar.
     * @returns Promise<Administrador> - El administrador guardado con su ID asignado.
     */
    async saveAdministrador(administrador: Administrador): Promise<Administrador> {
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
                administrador.getNombre(),
                administrador.getApellido(),
                administrador.getEmail(),
                administrador.getPassword(), // Asume que la contraseña ya está hasheada
                administrador.getTelefono(),
                'administrador',
                true
            ];
            
            const usuarioRes = await client.query(usuarioQuery, usuarioValues);
            const usuarioId = usuarioRes.rows[0].id;
            
            // Insertar en la tabla administradores
            const adminQuery = `
                INSERT INTO administradores (usuario_id)
                VALUES ($1)
            `;
            await client.query(adminQuery, [usuarioId]);
            
            // Insertar permisos
            for (const permiso of administrador.getPermisos()) {
                await this.asignarPermiso(client, usuarioId, permiso.getNombre());
            }
            
            await client.query('COMMIT');
            
            // Retornar el administrador creado con su ID
            return new Administrador({
                id: usuarioId,
                nombre: administrador.getNombre(),
                apellido: administrador.getApellido(),
                email: administrador.getEmail(),
                password: administrador.getPassword(),
                telefono: administrador.getTelefono(),
                permisos: administrador.getPermisos()
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    /**
     * Obtiene un administrador por su ID.
     * @param id - ID del administrador a buscar.
     * @returns Promise<Administrador | null> - El administrador encontrado o null si no existe.
     */
    async getAdministradorById(id: number): Promise<Administrador | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN administradores a ON u.id = a.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.id = $1
            GROUP BY u.id
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToAdministrador(result.rows[0]);
    }
    /**
     * Actualiza los datos de un administrador existente.
     * @param administrador - Objeto Administrador con los datos actualizados.
     * @returns Promise<Administrador> - El administrador actualizado.
     */
    async updateAdministrador(administrador: Administrador): Promise<Administrador> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Actualizar datos básicos en usuarios
            const updateUserQuery = `
                UPDATE usuarios
                SET nombre = $1, apellido = $2, telefono = $3
                WHERE id = $4
            `;
            await client.query(updateUserQuery, [
                administrador.getNombre(),
                administrador.getApellido(),
                administrador.getTelefono(),
                administrador.getId()
            ]);
            
            
            await client.query('COMMIT');
            
            return administrador;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    /**
     * Elimina un administrador por su ID.
     * @param id - ID del administrador a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async deleteAdministrador(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Eliminar permisos primero por restricciones de clave foránea
            await client.query(
                'DELETE FROM usuario_permisos WHERE usuario_id = $1',
                [id]
            );
            
            // Eliminar de administradores
            await client.query(
                'DELETE FROM administradores WHERE usuario_id = $1',
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

    private mapRowToAdministrador(row: any): Administrador {
        return new Administrador({
            id: row.id,
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
            password: '', // La contraseña no se retorna en las consultas
            telefono: row.telefono,
            permisos: row.permisos.filter((p: string | null) => p !== null)
        });
    }
    
}
