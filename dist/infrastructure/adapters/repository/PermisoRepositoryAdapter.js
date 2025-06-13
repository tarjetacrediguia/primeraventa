"use strict";
// src/infrastructure/repositories/PermisoRepositoryAdapter.ts
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
exports.PermisoRepositoryAdapter = void 0;
const Administrador_1 = require("../../../domain/entities/Administrador");
const Analista_1 = require("../../../domain/entities/Analista");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
const Comerciante_1 = require("../../../domain/entities/Comerciante");
const Permiso_1 = require("../../../domain/entities/Permiso");
class PermisoRepositoryAdapter {
    asignarPermisosARol(rol, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Eliminar permisos existentes para el rol
                yield client.query(`
                DELETE FROM usuario_permisos
                WHERE usuario_id IN (
                    SELECT id FROM usuarios WHERE rol = $1
                )
            `, [rol]);
                // Asignar nuevos permisos
                for (const permiso of permisos) {
                    const permisoId = yield this.getPermisoId(client, permiso);
                    yield client.query(`
                    INSERT INTO usuario_permisos (usuario_id, permiso_id)
                    SELECT id, $1
                    FROM usuarios
                    WHERE rol = $2
                `, [permisoId, rol]);
                }
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
    getAllPermisos() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT nombre, descripcion FROM permisos';
            const result = yield DatabaseDonfig_1.pool.query(query);
            return result.rows.map(row => Permiso_1.Permiso.fromMap(row));
        });
    }
    asignarPermisos(usuarioId, permisos) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield DatabaseDonfig_1.pool.connect();
            try {
                yield client.query('BEGIN');
                // Eliminar permisos existentes
                yield client.query('DELETE FROM usuario_permisos WHERE usuario_id = $1', [usuarioId]);
                // Asignar nuevos permisos
                for (const permiso of permisos) {
                    const permisoId = yield this.getPermisoId(client, permiso);
                    yield client.query(`
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
                const userResult = yield client.query(userQuery, [usuarioId]);
                if (userResult.rows.length === 0) {
                    throw new Error('Usuario no encontrado');
                }
                const userRow = userResult.rows[0];
                const permisosUsuario = yield this.getPermisosUsuario(usuarioId);
                yield client.query('COMMIT');
                // Crear instancia concreta según rol
                return this.crearUsuarioConcreto(userRow, permisosUsuario);
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
    crearPermiso(nombre_1, descripcion_1) {
        return __awaiter(this, arguments, void 0, function* (nombre, descripcion, categoria = "") {
            const query = `
            INSERT INTO permisos (nombre, descripcion)
            VALUES ($1, $2)
            RETURNING nombre, descripcion
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [nombre, descripcion]);
            return Permiso_1.Permiso.fromMap(result.rows[0]);
        });
    }
    usuarioTienePermiso(usuarioId, permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT COUNT(*) AS count
            FROM usuario_permisos up
            JOIN permisos p ON up.permiso_id = p.id
            WHERE up.usuario_id = $1 AND p.nombre = $2
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [usuarioId, permiso]);
            return parseInt(result.rows[0].count) > 0;
        });
    }
    getPermisosUsuario(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT p.nombre, p.descripcion
            FROM usuario_permisos up
            JOIN permisos p ON up.permiso_id = p.id
            WHERE up.usuario_id = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [usuarioId]);
            return result.rows.map(row => Permiso_1.Permiso.fromMap(row));
        });
    }
    getUsuariosConPermiso(permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol
            FROM usuarios u
            JOIN usuario_permisos up ON u.id = up.usuario_id
            JOIN permisos p ON up.permiso_id = p.id
            WHERE p.nombre = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [permiso]);
            return Promise.all(result.rows.map((row) => __awaiter(this, void 0, void 0, function* () {
                const permisos = yield this.getPermisosUsuario(parseInt(row.id));
                return this.crearUsuarioConcreto(row, permisos);
            })));
        });
    }
    getPermisoDetalle(permiso) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT nombre, descripcion 
            FROM permisos 
            WHERE nombre = $1
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [permiso]);
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
        });
    }
    actualizarPermiso(permiso, nuevaDescripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            UPDATE permisos 
            SET descripcion = $1 
            WHERE nombre = $2
            RETURNING nombre, descripcion
        `;
            const result = yield DatabaseDonfig_1.pool.query(query, [nuevaDescripcion, permiso]);
            if (result.rows.length === 0) {
                throw new Error("Permiso no encontrado");
            }
            return Permiso_1.Permiso.fromMap(result.rows[0]);
        });
    }
    // Helper Methods
    getPermisoId(client, permisoNombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id FROM permisos WHERE nombre = $1';
            const result = yield client.query(query, [permisoNombre]);
            if (result.rows.length === 0) {
                throw new Error(`Permiso ${permisoNombre} no encontrado`);
            }
            return result.rows[0].id;
        });
    }
    crearUsuarioConcreto(row, permisos) {
        const baseUsuario = {
            id: row.id.toString(),
            nombre: row.nombre,
            apellido: row.apellido,
            email: row.email,
            telefono: row.telefono,
            permisos: permisos
        };
        switch (row.rol) {
            case 'administrador':
                return new Administrador_1.Administrador(baseUsuario.id, baseUsuario.nombre, baseUsuario.apellido, baseUsuario.email, '', // Password no disponible
                baseUsuario.telefono, baseUsuario.permisos);
            case 'analista':
                return new Analista_1.Analista(baseUsuario.id, baseUsuario.nombre, baseUsuario.apellido, baseUsuario.email, '', // Password no disponible
                baseUsuario.telefono, baseUsuario.permisos);
            case 'comerciante':
                return new Comerciante_1.Comerciante(baseUsuario.id, baseUsuario.nombre, baseUsuario.apellido, baseUsuario.email, '', // Password no disponible
                baseUsuario.telefono, row.cuil, row.nombre_comercio, row.direccion_comercio, baseUsuario.permisos);
            default:
                throw new Error(`Rol desconocido: ${row.rol}`);
        }
    }
}
exports.PermisoRepositoryAdapter = PermisoRepositoryAdapter;
