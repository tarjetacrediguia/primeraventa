"use strict";
//src/infrastructure/adapters/repository/AnalistaRepositoryAdapter.ts
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
exports.AnalistaRepositoryAdapter = void 0;
const Analista_1 = require("../../../domain/entities/Analista");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class AnalistaRepositoryAdapter {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToAnalista(result.rows[0]);
        });
    }
    saveAnalista(analista) {
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
                    analista.getNombre(),
                    analista.getApellido(),
                    analista.getEmail(),
                    analista.getPassword(),
                    analista.getTelefono(),
                    'analista',
                    true
                ];
                const usuarioRes = yield client.query(usuarioQuery, usuarioValues);
                const usuarioId = usuarioRes.rows[0].id;
                // Insertar en la tabla analistas
                const analistaQuery = `
                INSERT INTO analistas (usuario_id)
                VALUES ($1)
            `;
                yield client.query(analistaQuery, [usuarioId]);
                // Insertar permisos
                for (const permiso of analista.getPermisos()) {
                    yield this.asignarPermiso(client, usuarioId, permiso);
                }
                yield client.query('COMMIT');
                // Retornar el analista creado con su ID
                return new Analista_1.Analista(usuarioId, analista.getNombre(), analista.getApellido(), analista.getEmail(), analista.getPassword(), analista.getTelefono(), analista.getPermisos());
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
    getAnalistaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return this.mapRowToAnalista(result.rows[0]);
        });
    }
    updateAnalista(analista) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Actualizar datos básicos en usuarios
                const updateUserQuery = `
                UPDATE usuarios
                SET nombre = $1, apellido = $2, email = $3, telefono = $4
                WHERE id = $5
            `;
                yield client.query(updateUserQuery, [
                    analista.getNombre(),
                    analista.getApellido(),
                    analista.getEmail(),
                    analista.getTelefono(),
                    analista.getId()
                ]);
                // Actualizar permisos
                yield client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [analista.getId()]);
                for (const permiso of analista.getPermisos()) {
                    if (analista.getId() === undefined) {
                        throw new Error("El ID del analista es undefined.");
                    }
                    yield this.asignarPermiso(client, analista.getId(), permiso);
                }
                yield client.query('COMMIT');
                return analista;
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
    deleteAnalista(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Eliminar permisos primero por restricciones de clave foránea
                yield client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [id]);
                // Eliminar de analistas
                yield client.query('DELETE FROM analistas WHERE usuario_id = $1', [id]);
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
    getAllAnalistas() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => this.mapRowToAnalista(row));
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
    mapRowToAnalista(row) {
        return new Analista_1.Analista(Number(row.id), row.nombre, row.apellido, row.email, '', // La contraseña no se retorna en las consultas
        row.telefono, row.permisos.filter((p) => p !== null));
    }
}
exports.AnalistaRepositoryAdapter = AnalistaRepositoryAdapter;
