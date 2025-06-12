// src/infrastructure/repositories/PermisoRepositoryAdapter.ts

import { PermisoRepositoryPort } from "../../../application/ports/PermisoRepositoryPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Administrador } from "../../../domain/entities/Administrador";
import { Analista } from "../../../domain/entities/Analista";
import { pool } from "../../config/Database/DatabaseDonfig";
import { Comerciante } from "../../../domain/entities/Comerciante";

export class PermisoRepositoryAdapter implements PermisoRepositoryPort {
    
    async getAllPermisos(): Promise<string[]> {
        const query = 'SELECT nombre FROM permisos';
        const result = await pool.query(query);
        return result.rows.map(row => row.nombre);
    }

    async asignarPermisos(usuarioId: number, permisos: string[]): Promise<Usuario> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Eliminar permisos existentes
            await client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [usuarioId]);
            
            // Asignar nuevos permisos
            for (const permiso of permisos) {
                const permisoId = await this.getPermisoId(client, permiso);
                await client.query(`
                    INSERT INTO usuario_permisos (usuario_id, permiso_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `, [usuarioId, permisoId]);
            }
            
            // Obtener usuario con su rol
            const userQuery = `
                SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol 
                FROM usuarios u 
                WHERE u.id = $1
            `;
            const userResult = await client.query(userQuery, [usuarioId]);
            
            if (userResult.rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            
            const userRow = userResult.rows[0];
            const permisosUsuario = await this.getPermisosUsuario(usuarioId);
            
            await client.query('COMMIT');
            
            // Crear instancia concreta según rol
            return this.crearUsuarioConcreto(
                userRow,
                permisosUsuario
            );
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async crearPermiso(nombre: string, descripcion: string, categoria: string): Promise<string> {
        const query = `
            INSERT INTO permisos (nombre, descripcion, categoria)
            VALUES ($1, $2, $3)
            RETURNING nombre
        `;
        const result = await pool.query(query, [nombre, descripcion, categoria]);
        return result.rows[0].nombre;
    }

    async usuarioTienePermiso(usuarioId: number, permiso: string): Promise<boolean> {
        const query = `
            SELECT COUNT(*) AS count
            FROM usuario_permisos up
            JOIN permisos p ON up.permiso_id = p.id
            WHERE up.usuario_id = $1 AND p.nombre = $2
        `;
        const result = await pool.query(query, [usuarioId, permiso]);
        return parseInt(result.rows[0].count) > 0;
    }

    async getPermisosUsuario(usuarioId: number): Promise<string[]> {
        const query = `
            SELECT p.nombre
            FROM usuario_permisos up
            JOIN permisos p ON up.permiso_id = p.id
            WHERE up.usuario_id = $1
        `;
        const result = await pool.query(query, [usuarioId]);
        return result.rows.map((row: { nombre: any; }) => row.nombre);
    }

    async getUsuariosConPermiso(permiso: string): Promise<Usuario[]> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol
            FROM usuarios u
            JOIN usuario_permisos up ON u.id = up.usuario_id
            JOIN permisos p ON up.permiso_id = p.id
            WHERE p.nombre = $1
        `;
        const result = await pool.query(query, [permiso]);
        
        return Promise.all(result.rows.map(async (row: { id: string; }) => {
            const permisos = await this.getPermisosUsuario(parseInt(row.id));
            return this.crearUsuarioConcreto(row, permisos);
        }));
    }

    async getPermisoDetalle(permiso: string): Promise<{ 
        nombre: string; 
        descripcion: string; 
        categoria: string; 
        fechaCreacion: Date; 
    } | null> {
        const query = `
            SELECT nombre, descripcion, categoria, fecha_creacion AS "fechaCreacion" 
            FROM permisos 
            WHERE nombre = $1
        `;
        const result = await pool.query(query, [permiso]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        return {
            nombre: row.nombre,
            descripcion: row.descripcion,
            categoria: row.categoria,
            fechaCreacion: new Date(row.fechaCreacion)
        };
    }

    async actualizarPermiso(permiso: string, nuevaDescripcion: string): Promise<void> {
        const query = 'UPDATE permisos SET descripcion = $1 WHERE nombre = $2';
        await pool.query(query, [nuevaDescripcion, permiso]);
    }

    // Helper Methods
    private async getPermisoId(client: any, permisoNombre: string): Promise<number> {
        const query = 'SELECT id FROM permisos WHERE nombre = $1';
        const result = await client.query(query, [permisoNombre]);
        
        if (result.rows.length === 0) {
            throw new Error(`Permiso ${permisoNombre} no encontrado`);
        }
        
        return result.rows[0].id;
    }

    private crearUsuarioConcreto(row: any, permisos: string[]): Usuario {
        const baseUsuario = {
            id: row.id.toString(),
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
            telefono: row.telefono,
            permisos: permisos
        };

        switch(row.rol) {
            case 'administrador':
                return new Administrador(
                    baseUsuario.id,
                    baseUsuario.nombre,
                    baseUsuario.apellido,
                    baseUsuario.email,
                    '', // Password no disponible
                    baseUsuario.telefono,
                    baseUsuario.permisos
                );
                
            case 'analista':
                return new Analista(
                    baseUsuario.id,
                    baseUsuario.nombre,
                    baseUsuario.apellido,
                    baseUsuario.email,
                    '', // Password no disponible
                    baseUsuario.telefono,
                    baseUsuario.permisos
                );
                
            case 'comerciante':
                // Asumiendo que existe clase Comerciante
                return new Comerciante(
                    baseUsuario.id,
                    baseUsuario.nombre,
                    baseUsuario.apellido,
                    baseUsuario.email,
                    '', // Password no disponible
                    baseUsuario.telefono,
                    'CUIL',              // Requieren queries adicionales
                    'Nombre Comercio', // Datos específicos
                    'Direccion Comercio', // Dirección del comercio
                    baseUsuario.permisos
                );
                
            default:
                throw new Error(`Rol desconocido: ${row.rol}`);
        }
    }
}