"use strict";
//src/infrastructure/adapters/repository/ComercianteRepositoryAdapter.ts
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
exports.ComercianteRepositoryAdapter = void 0;
const Comerciante_1 = require("../../../domain/entities/Comerciante");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class ComercianteRepositoryAdapter {
    /**
     * Busca un comerciante por su email.
     * @param email - Email del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToComerciante(result.rows[0]);
        });
    }
    /**
     * Busca un comerciante por su CUIL.
     * @param cuil - CUIL del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    findByCuil(cuil) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, [cuil]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToComerciante(result.rows[0]);
        });
    }
    /**
     * Guarda un nuevo comerciante en la base de datos.
     * @param comerciante - Objeto Comerciante a guardar.
     * @returns Promise<Comerciante> - El comerciante guardado con su ID asignado.
     */
    saveComerciante(comerciante) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
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
                const usuarioRes = yield client.query(usuarioQuery, usuarioValues);
                const usuarioId = usuarioRes.rows[0].id;
                // Insertar en la tabla comerciantes
                const comercianteQuery = `
                INSERT INTO comerciantes (usuario_id, nombre_comercio, cuil, direccion_comercio)
                VALUES ($1, $2, $3, $4)
            `;
                yield client.query(comercianteQuery, [
                    usuarioId,
                    comerciante.getNombreComercio(),
                    comerciante.getCuil(),
                    comerciante.getDireccionComercio()
                ]);
                // Insertar permisos
                for (const permiso of comerciante.getPermisos()) {
                    yield this.asignarPermiso(client, usuarioId, permiso.getNombre());
                }
                yield client.query('COMMIT');
                // Retornar el comerciante creado con su ID
                return new Comerciante_1.Comerciante(usuarioId, comerciante.getNombre(), comerciante.getApellido(), comerciante.getEmail(), comerciante.getPassword(), comerciante.getTelefono(), comerciante.getNombreComercio(), comerciante.getCuil(), comerciante.getDireccionComercio(), comerciante.getPermisos());
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene un comerciante por su ID.
     * @param id - ID del comerciante a buscar.
     * @returns Promise<Comerciante | null> - El comerciante encontrado o null si no existe.
     */
    getComercianteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToComerciante(result.rows[0]);
        });
    }
    /**
     * Actualiza los datos de un comerciante existente.
     * @param comerciante - Objeto Comerciante con los datos actualizados.
     * @returns Promise<Comerciante> - El comerciante actualizado.
     */
    updateComerciante(comerciante) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            const id = comerciante.getId();
            if (!id) {
                throw new Error('El comerciante debe tener un ID para ser actualizado');
            }
            try {
                yield client.query('BEGIN');
                // Actualizar datos básicos en usuarios
                const updateUserQuery = `
                UPDATE usuarios
                SET nombre = $1, apellido = $2, email = $3, telefono = $4
                WHERE id = $5
            `;
                yield client.query(updateUserQuery, [
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
                yield client.query(updateComercianteQuery, [
                    comerciante.getNombreComercio(),
                    comerciante.getCuil(),
                    comerciante.getDireccionComercio(),
                    id
                ]);
                yield client.query('COMMIT');
                return comerciante;
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Elimina un comerciante por su ID.
     * @param id - ID del comerciante a eliminar.
     * @returns Promise<void> - No retorna valor.
     */
    deleteComerciante(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Eliminar permisos primero por restricciones de clave foránea
                yield client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [id]);
                // Eliminar de comerciantes
                yield client.query('DELETE FROM comerciantes WHERE usuario_id = $1', [id]);
                // Finalmente eliminar de usuarios
                yield client.query('DELETE FROM usuarios WHERE id = $1', [id]);
                yield client.query('COMMIT');
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
            finally {
                client.release();
            }
        });
    }
    /**
     * Obtiene todos los comerciantes del sistema.
     * @returns Promise<Comerciante[]> - Array de comerciantes con sus permisos.
     */
    getAllComerciantes() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => this.mapRowToComerciante(row));
        });
    }
    asignarPermiso(client, usuarioId, permisoNombre) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener ID del permiso
            const permisoRes = yield client.query('SELECT id FROM permisos WHERE nombre = $1', [permisoNombre]);
            if (permisoRes.rows.length === 0) {
                throw new Error(`Permiso '${permisoNombre}' no encontrado`);
            }
            const permisoId = permisoRes.rows[0].id;
            // Asignar permiso al usuario
            yield client.query(`
            INSERT INTO usuario_permisos (usuario_id, permiso_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [usuarioId, permisoId]);
        });
    }
    mapRowToComerciante(row) {
        return new Comerciante_1.Comerciante(Number(row.id), row.nombre, row.apellido, row.email, '', // La contraseña no se retorna en las consultas
        row.telefono, row.nombre_comercio, row.cuil, row.direccion_comercio, row.permisos.filter((p) => p !== null));
    }
}
exports.ComercianteRepositoryAdapter = ComercianteRepositoryAdapter;
