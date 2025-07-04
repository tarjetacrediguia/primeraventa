//src/infrastructure/adapters/repository/ComercianteRepositoryAdapter.ts

import { ComercianteRepositoryPort } from "../../../application/ports/ComercianteRepositoryPort";
import { Comerciante } from "../../../domain/entities/Comerciante";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ComercianteRepositoryAdapter implements ComercianteRepositoryPort {
    async findByEmail(email: string): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.nombre_comercio, c.cuil, c.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.email = $1 AND u.rol = 'comerciante'
            GROUP BY u.id, c.nombre_comercio, c.cuil, c.direccion_comercio
        `;
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    async findByCuil(cuil: string): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.nombre_comercio, c.cuil, c.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE c.cuil = $1
            GROUP BY u.id, c.nombre_comercio, c.cuil, c.direccion_comercio
        `;
        const result = await pool.query(query, [cuil]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    async saveComerciante(comerciante: Comerciante): Promise<Comerciante> {
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
                comerciante.getNombre(),
                comerciante.getApellido(),
                comerciante.getEmail(),
                comerciante.getPassword(),
                comerciante.getTelefono(),
                'comerciante',
                true
            ];
            
            const usuarioRes = await client.query(usuarioQuery, usuarioValues);
            const usuarioId = usuarioRes.rows[0].id;
            
            // Insertar en la tabla comerciantes
            const comercianteQuery = `
                INSERT INTO comerciantes (usuario_id, nombre_comercio, cuil, direccion_comercio)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(comercianteQuery, [
                usuarioId,
                comerciante.getNombreComercio(),
                comerciante.getCuil(),
                comerciante.getDireccionComercio()
            ]);
            
            // Insertar permisos
            for (const permiso of comerciante.getPermisos()) {
                await this.asignarPermiso(client, usuarioId, permiso.getNombre());
            }
            
            await client.query('COMMIT');
            
            // Retornar el comerciante creado con su ID
            return new Comerciante(
                usuarioId,
                comerciante.getNombre(),
                comerciante.getApellido(),
                comerciante.getEmail(),
                comerciante.getPassword(),
                comerciante.getTelefono(),
                comerciante.getNombreComercio(),
                comerciante.getCuil(),
                comerciante.getDireccionComercio(),
                comerciante.getPermisos()
            );
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getComercianteById(id: number): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.nombre_comercio, c.cuil, c.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.id = $1
            GROUP BY u.id, c.nombre_comercio, c.cuil, c.direccion_comercio
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    async updateComerciante(comerciante: Comerciante): Promise<Comerciante> {
        const client = await pool.connect();
        const id = comerciante.getId();
        if (!id) {
            throw new Error('El comerciante debe tener un ID para ser actualizado');
        }
        try {
            await client.query('BEGIN');
            
            // Actualizar datos básicos en usuarios
            const updateUserQuery = `
                UPDATE usuarios
                SET nombre = $1, apellido = $2, email = $3, telefono = $4
                WHERE id = $5
            `;
            await client.query(updateUserQuery, [
                comerciante.getNombre(),
                comerciante.getApellido(),
                comerciante.getEmail(),
                comerciante.getTelefono(),
                id
            ]);
            
            // Actualizar datos específicos de comerciante
            const updateComercianteQuery = `
                UPDATE comerciantes
                SET nombre_comercio = $1, cuil = $2, direccion_comercio = $3
                WHERE usuario_id = $4
            `;
            await client.query(updateComercianteQuery, [
                comerciante.getNombreComercio(),
                comerciante.getCuil(),
                comerciante.getDireccionComercio(),
                id
            ]);
            
            await client.query('COMMIT');
            
            return comerciante;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteComerciante(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Eliminar permisos primero por restricciones de clave foránea
            await client.query(
                'DELETE FROM usuario_permisos WHERE usuario_id = $1',
                [id]
            );
            
            // Eliminar de comerciantes
            await client.query(
                'DELETE FROM comerciantes WHERE usuario_id = $1',
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

    async getAllComerciantes(): Promise<Comerciante[]> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.nombre_comercio, c.cuil, c.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.rol = 'comerciante'
            GROUP BY u.id, c.nombre_comercio, c.cuil, c.direccion_comercio
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToComerciante(row));
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

    private mapRowToComerciante(row: any): Comerciante {
        return new Comerciante(
            Number(row.id),
            row.nombre,
            row.apellido,
            row.email,
            '', // La contraseña no se retorna en las consultas
            row.telefono,
            row.nombre_comercio,
            row.cuil,
            row.direccion_comercio,
            row.permisos.filter((p: string | null) => p !== null)
        );
    }
}
