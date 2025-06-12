//src/infrastructure/adapters/repository/AdministradorRepositoryAdapter.ts

import { AdministradorRepositoryPort } from "../../../application/ports/AdministradorRepositoryPort";
import { Administrador } from "../../../domain/entities/Administrador";
import { pool } from "../../config/Database/DatabaseDonfig";

export class AdministradorRepositoryAdapter implements AdministradorRepositoryPort {
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
                await this.asignarPermiso(client, usuarioId, permiso);
            }
            
            await client.query('COMMIT');
            
            // Retornar el administrador creado con su ID
            return new Administrador(
                usuarioId,
                administrador.getNombre(),
                administrador.getApellido(),
                administrador.getEmail(),
                administrador.getPassword(),
                administrador.getTelefono(),
                administrador.getPermisos()
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
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
    async updateAdministrador(administrador: Administrador): Promise<Administrador> {
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
                administrador.getNombre(),
                administrador.getApellido(),
                administrador.getEmail(),
                administrador.getTelefono(),
                administrador.getId()
            ]);
            
            // Actualizar permisos
            await client.query(
                'DELETE FROM usuario_permisos WHERE usuario_id = $1',
                [administrador.getId()]
            );
            
            for (const permiso of administrador.getPermisos()) {
                if (!administrador.getId()) {
                    throw new Error("El ID del administrador es undefined.");
                }
                await this.asignarPermiso(client, administrador.getId(), permiso);
            }
            
            await client.query('COMMIT');
            
            return administrador;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
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
        return new Administrador(
            row.id.toString(),
            row.nombre,
            row.apellido,
            row.email,
            '', // La contraseña no se retorna en las consultas
            row.telefono,
            row.permisos.filter((p: string | null) => p !== null)
        );
    }
    
}