"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdapter = void 0;
const Administrador_1 = require("../../../domain/entities/Administrador");
const Analista_1 = require("../../../domain/entities/Analista");
const Comerciante_1 = require("../../../domain/entities/Comerciante");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
const JWT_SECRET = process.env.JWT_SECRET || 'kjhskdf65454sdfkhvxtu_clave_secreta_muy_segura';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
class AuthAdapter {
    generarToken(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                id: usuario.getId(),
                email: usuario.getEmail(),
                rol: usuario.getRol()
            };
            const options = {
                expiresIn: 1 * 60 * 60, // 1 hora
            };
            return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
        });
    }
    validarToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return {
                id: decoded.id,
                rol: decoded.rol
            };
        }
        catch (error) {
            return null;
        }
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar usuario por email
            const userResult = yield DatabaseDonfig_1.pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            console.log('userResult:', userResult.rows);
            if (userResult.rows.length === 0) {
                throw new Error('Credenciales inválidas');
            }
            const userRow = userResult.rows[0];
            const passwordMatch = yield bcrypt_1.default.compare(password, userRow.password_hash);
            console.log('passwordMatch:', passwordMatch);
            if (!passwordMatch) {
                throw new Error('Credenciales inválidas');
            }
            // Crear instancia de Usuario según el rol
            let usuario;
            switch (userRow.rol) {
                case 'administrador':
                    // Obtener permisos adicionales
                    const permisosResult = yield DatabaseDonfig_1.pool.query(`SELECT p.nombre 
                     FROM usuario_permisos up
                     JOIN permisos p ON up.permiso_id = p.id
                     WHERE up.usuario_id = $1`, [userRow.id]);
                    const permisos = permisosResult.rows.map(row => row.nombre);
                    usuario = new Administrador_1.Administrador(userRow.id.toString(), userRow.nombre, userRow.apellido, userRow.email, userRow.password_hash, userRow.telefono, permisos);
                    break;
                case 'analista':
                    usuario = new Analista_1.Analista(userRow.id.toString(), userRow.nombre, userRow.apellido, userRow.email, userRow.password_hash, userRow.telefono, [] // permisos vacío o ajusta según tu lógica
                    );
                    break;
                case 'comerciante':
                    // Obtener datos adicionales del comerciante
                    const comercianteResult = yield DatabaseDonfig_1.pool.query('SELECT * FROM comerciantes WHERE usuario_id = $1', [userRow.id]);
                    if (comercianteResult.rows.length === 0) {
                        throw new Error('Datos de comerciante no encontrados');
                    }
                    const comercianteRow = comercianteResult.rows[0];
                    usuario = new Comerciante_1.Comerciante(userRow.id.toString(), userRow.nombre, userRow.apellido, userRow.email, userRow.password_hash, userRow.telefono, comercianteRow.nombre_comercio, comercianteRow.cuil, comercianteRow.direccion_comercio, [] // permisos vacío o ajusta según tu lógica
                    );
                    break;
                default:
                    throw new Error('Rol no reconocido');
            }
            // Generar token
            const token = yield this.generarToken(usuario);
            // Registrar sesión en la base de datos
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1); // 1 hora de expiración
            yield DatabaseDonfig_1.pool.query(`INSERT INTO sesiones (usuario_id, token, fecha_expiracion)
             VALUES ($1, $2, $3)`, [userRow.id, token, expirationDate]);
            return { usuario, token };
        });
    }
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Inactivar la sesión en la base de datos
            yield DatabaseDonfig_1.pool.query('UPDATE sesiones SET activa = FALSE WHERE token = $1', [token]);
        });
    }
    register(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar token
            const payload = this.validarToken(token);
            if (!payload) {
                throw new Error('Token inválido o expirado');
            }
            // Hashear nueva contraseña
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
            // Actualizar contraseña en la base de datos
            yield DatabaseDonfig_1.pool.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hashedPassword, payload.id]);
        });
    }
    changePassword(usuarioId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener usuario
            const userResult = yield DatabaseDonfig_1.pool.query('SELECT password_hash FROM usuarios WHERE id = $1', [usuarioId]);
            if (userResult.rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }
            const user = userResult.rows[0];
            // Verificar contraseña actual
            const passwordMatch = yield bcrypt_1.default.compare(oldPassword, user.password_hash);
            if (!passwordMatch) {
                throw new Error('Contraseña actual incorrecta');
            }
            // Hashear nueva contraseña
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
            // Actualizar contraseña
            yield DatabaseDonfig_1.pool.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hashedPassword, usuarioId]);
        });
    }
}
exports.AuthAdapter = AuthAdapter;
