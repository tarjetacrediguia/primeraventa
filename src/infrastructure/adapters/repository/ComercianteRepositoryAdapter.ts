//src/infrastructure/adapters/repository/ComercianteRepositoryAdapter.ts

/**
 * ADAPTADOR: Repositorio de Comerciantes
 *
 * Este archivo implementa el adaptador para el repositorio de comerciantes.
 * Proporciona métodos para interactuar con la base de datos PostgreSQL
 * y gestionar las operaciones CRUD de comerciantes.
 */

import { ComercianteRepositoryPort } from "../../../application/ports/ComercianteRepositoryPort";
import { Comerciante } from "../../../domain/entities/Comerciante";
import { Comercio } from "../../../domain/entities/Comercio";
import { pool } from "../../config/Database/DatabaseDonfig";

export class ComercianteRepositoryAdapter implements ComercianteRepositoryPort {
    
    async findById(id: number): Promise<Comerciante> {
    const query = `
        SELECT 
            u.id,
            u.nombre,
            u.apellido,
            u.email,
            u.password_hash as password,
            u.telefono,
            u.activo,
            c.numero_comercio,
            co.nombre_comercio,
            co.cuil,
            co.direccion_comercio,
            ARRAY_AGG(p.nombre) AS permisos
        FROM usuarios u
        INNER JOIN comerciantes c ON u.id = c.usuario_id
        INNER JOIN comercios co ON c.numero_comercio = co.numero_comercio
        LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
        LEFT JOIN permisos p ON up.permiso_id = p.id
        WHERE u.id = $1 AND u.activo = true
        GROUP BY u.id, c.numero_comercio, co.numero_comercio, co.nombre_comercio, co.cuil, co.direccion_comercio
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
        throw new Error("Comerciante no encontrado");
    }

    const row = result.rows[0];
    
    // Crear instancia de Comercio
    const comercio = new Comercio({
        numeroComercio: row.numero_comercio,
        nombreComercio: row.nombre_comercio,
        cuil: row.cuil,
        direccionComercio: row.direccion_comercio
    });
    
    return new Comerciante({
        id: row.id,
        nombre: row.nombre,
        apellido: row.apellido,
        email: row.email,
        password: row.password,
        telefono: row.telefono,
        comercio: comercio,
        permisos: row.permisos ? row.permisos.filter((p: string | null) => p !== null) : [],
        activo: row.activo
    });
}
        
    /**
     * Busca un comerciante por su email.
     * @param email - Email del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    async findByEmail(email: string): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.numero_comercio,
                   co.nombre_comercio, co.cuil, co.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            INNER JOIN comercios co ON c.numero_comercio = co.numero_comercio
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.email = $1 AND u.rol = 'comerciante'
            GROUP BY u.id, c.numero_comercio, co.numero_comercio
        `;
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    /**
     * Busca un comerciante por su CUIL.
     * @param cuil - CUIL del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    async findByCuil(cuil: string): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.nombre_comercio, c.cuil, c.direccion_comercio, c.numero_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE c.cuil = $1
            GROUP BY u.id, c.nombre_comercio, c.cuil, c.direccion_comercio, c.numero_comercio
        `;
        const result = await pool.query(query, [cuil]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    /**
     * Guarda un nuevo comerciante en la base de datos.
     * @param comerciante - Objeto Comerciante a guardar.
     * @returns Promise<Comerciante> - El comerciante guardado con su ID asignado.
     */
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
                INSERT INTO comerciantes (usuario_id, numero_comercio)
                VALUES ($1, $2)
            `;
            await client.query(comercianteQuery, [
                usuarioId,
                comerciante.getComercio().getNumeroComercio()
            ]);
            
            // Insertar permisos
            for (const permiso of comerciante.getPermisos()) {
                await this.asignarPermiso(client, usuarioId, permiso.getNombre());
            }
            
            await client.query('COMMIT');
            
            // Retornar el comerciante creado con su ID
            return new Comerciante({
                id: usuarioId,
                nombre: comerciante.getNombre(),
                apellido: comerciante.getApellido(),
                email: comerciante.getEmail(),
                password: comerciante.getPassword(),
                telefono: comerciante.getTelefono(),
                comercio: comerciante.getComercio(),
                permisos: comerciante.getPermisos()
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene un comerciante por su ID.
     * @param id - ID del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    async getComercianteById(id: number): Promise<Comerciante | null> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.numero_comercio,
                   co.nombre_comercio, co.cuil, co.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            INNER JOIN comercios co ON c.numero_comercio = co.numero_comercio
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.id = $1
            GROUP BY u.id, c.numero_comercio, co.numero_comercio
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.mapRowToComerciante(result.rows[0]);
    }

    /**
     * Actualiza los datos de un comerciante existente.
     * @param comerciante - Objeto Comerciante con los datos actualizados.
     * @returns Promise<Comerciante> - El comerciante actualizado.
     */
    async updateComerciante(comerciante: Comerciante): Promise<Comerciante> {
        const client = await pool.connect();
        const id = comerciante.getId();
        if (!id) {
            throw new Error('El comerciante debe tener un ID para ser actualizado');
        }
        try {
            await client.query('BEGIN');
            
            // Determinar si se está actualizando la contraseña
            const actualizarPassword = comerciante.getPassword() && comerciante.getPassword() !== '';
            
            // Actualizar datos básicos en usuarios
            let updateUserQuery: string;
            let updateUserValues: any[];
            
            if (actualizarPassword) {
                updateUserQuery = `
                    UPDATE usuarios
                    SET nombre = $1, apellido = $2, email = $3, telefono = $4, 
                        password_hash = $5, fecha_actualizacion = CURRENT_TIMESTAMP
                    WHERE id = $6
                `;
                updateUserValues = [
                    comerciante.getNombre(),
                    comerciante.getApellido(),
                    comerciante.getEmail(),
                    comerciante.getTelefono(),
                    comerciante.getPassword(),
                    id
                ];
            } else {
                updateUserQuery = `
                    UPDATE usuarios
                    SET nombre = $1, apellido = $2, email = $3, telefono = $4,
                        fecha_actualizacion = CURRENT_TIMESTAMP
                    WHERE id = $5
                `;
                updateUserValues = [
                    comerciante.getNombre(),
                    comerciante.getApellido(),
                    comerciante.getEmail(),
                    comerciante.getTelefono(),
                    id
                ];
            }
            
            await client.query(updateUserQuery, updateUserValues);
            
            // Actualizar número de comercio si es necesario
            if (comerciante.getComercio() && comerciante.getComercio().getNumeroComercio()) {
                const updateComercianteQuery = `
                    UPDATE comerciantes
                    SET numero_comercio = $1
                    WHERE usuario_id = $2
                `;
                await client.query(updateComercianteQuery, [
                    comerciante.getComercio().getNumeroComercio(),
                    id
                ]);
            }
            
            await client.query('COMMIT');
            
            return comerciante;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Elimina un comerciante por su ID.
     * @param id - ID del comerciante a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    async deleteComerciante(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            await client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [id]);
            await client.query('DELETE FROM comerciantes WHERE usuario_id = $1', [id]);
            await client.query('DELETE FROM usuarios WHERE id = $1', [id]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Obtiene todos los comerciantes del sistema.
     * @returns Promise<Comerciante[]> - Array de comerciantes con sus permisos.
     */
    async getAllComerciantes(): Promise<Comerciante[]> {
        const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono,
                   c.numero_comercio,
                   co.nombre_comercio, co.cuil, co.direccion_comercio,
                   ARRAY_AGG(p.nombre) AS permisos
            FROM usuarios u
            INNER JOIN comerciantes c ON u.id = c.usuario_id
            INNER JOIN comercios co ON c.numero_comercio = co.numero_comercio
            LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
            LEFT JOIN permisos p ON up.permiso_id = p.id
            WHERE u.rol = 'comerciante'
            GROUP BY u.id, c.numero_comercio, co.numero_comercio
        `;
        const result = await pool.query(query);
        return result.rows.map(row => this.mapRowToComerciante(row));
    }

    private async asignarPermiso(client: any, usuarioId: number, permisoNombre: string): Promise<void> {
        const permisoRes = await client.query('SELECT id FROM permisos WHERE nombre = $1', [permisoNombre]);
        if (permisoRes.rows.length === 0) {
            throw new Error(`Permiso '${permisoNombre}' no encontrado`);
        }
        const permisoId = permisoRes.rows[0].id;
        
        await client.query(`
            INSERT INTO usuario_permisos (usuario_id, permiso_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [usuarioId, permisoId]);
    }

    private mapRowToComerciante(row: any): Comerciante {
        const comercio = new Comercio({
            numeroComercio: row.numero_comercio,
            nombreComercio: row.nombre_comercio,
            cuil: row.cuil,
            direccionComercio: row.direccion_comercio
        });

        return new Comerciante({
            id: Number(row.id),
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
            password: '',
            telefono: row.telefono,
            comercio: comercio,
            permisos: row.permisos.filter((p: string | null) => p !== null)
        });
    }
}
