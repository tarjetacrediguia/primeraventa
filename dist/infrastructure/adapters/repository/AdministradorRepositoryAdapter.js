"use strict";
//src/infrastructure/adapters/repository/AdministradorRepositoryAdapter.ts
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
exports.AdministradorRepositoryAdapter = void 0;
const Administrador_1 = require("../../../domain/entities/Administrador");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
class AdministradorRepositoryAdapter {
    getAllAdministradores() {
        throw new Error("Method not implemented.");
    }
    saveAdministrador(administrador) {
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
                    administrador.getNombre(),
                    administrador.getApellido(),
                    administrador.getEmail(),
                    administrador.getPassword(), // Asume que la contraseña ya está hasheada
                    administrador.getTelefono(),
                    'administrador',
                    true
                ];
                const usuarioRes = yield client.query(usuarioQuery, usuarioValues);
                const usuarioId = usuarioRes.rows[0].id;
                // Insertar en la tabla administradores
                const adminQuery = `
                INSERT INTO administradores (usuario_id)
                VALUES ($1)
            `;
                yield client.query(adminQuery, [usuarioId]);
                // Insertar permisos
                for (const permiso of administrador.getPermisos()) {
                    yield this.asignarPermiso(client, usuarioId, permiso);
                }
                yield client.query('COMMIT');
                // Retornar el administrador creado con su ID
                return new Administrador_1.Administrador(usuarioId, administrador.getNombre(), administrador.getApellido(), administrador.getEmail(), administrador.getPassword(), administrador.getTelefono(), administrador.getPermisos());
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
    getAdministradorById(id) {
        throw new Error("Method not implemented.");
    }
    updateAdministrador(administrador) {
        throw new Error("Method not implemented.");
    }
    deleteAdministrador(id) {
        throw new Error("Method not implemented.");
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
    mapRowToAdministrador(row) {
        return new Administrador_1.Administrador(row.id, row.nombre, row.apellido, row.email, '', // La contraseña no se retorna en las consultas
        row.telefono, row.permisos || []);
    }
}
exports.AdministradorRepositoryAdapter = AdministradorRepositoryAdapter;
