// src/infrastructure/adapters/authorization/AuthAdapter.ts
import { AuthPort } from "../../../application/ports/AuthPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Administrador } from "../../../domain/entities/Administrador";
import { Analista } from "../../../domain/entities/Analista";
import { Comerciante } from "../../../domain/entities/Comerciante";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../../config/Database/DatabaseDonfig";
import { QueryResult } from 'pg';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'kjhskdf65454sdfkhvxtu_clave_secreta_muy_segura';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

export class AuthAdapter implements AuthPort {
async generarToken(usuario: Usuario): Promise<string> {
    const payload = {
        id: usuario.getId(),
        email: usuario.getEmail(),
        rol: usuario.getRol()
    };

    const options: jwt.SignOptions = {
        expiresIn: 1 * 60 * 60, // 1 hora
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

    validarToken(token: string): { id: string; rol: string } | null {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string; rol: string };
            return {
                id: decoded.id,
                rol: decoded.rol
            };
        } catch (error) {
            return null;
        }
    }

    async login(email: string, password: string): Promise<{ usuario: Usuario; token: string }> {
        // Buscar usuario por email
        const userResult: QueryResult = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        console.log('userResult:', userResult.rows);
        if (userResult.rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }
        
        
        const userRow = userResult.rows[0];
        const saltRounds = 10;
        const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
        console.log('passwordMatch:', passwordMatch);
        
        if (!passwordMatch) {
            throw new Error('Credenciales inválidas');
        }
        
        // Crear instancia de Usuario según el rol
        let usuario: Usuario;
        switch (userRow.rol) {
            case 'administrador':
                // Obtener permisos adicionales
                const permisosResult = await pool.query(
                    `SELECT p.nombre 
                     FROM usuario_permisos up
                     JOIN permisos p ON up.permiso_id = p.id
                     WHERE up.usuario_id = $1`,
                    [userRow.id]
                );
                
                const permisos = permisosResult.rows.map(row => row.nombre);
                usuario = new Administrador(
                    userRow.id.toString(),
                    userRow.nombre,
                    userRow.apellido,
                    userRow.email,
                    userRow.password_hash,
                    userRow.telefono,
                    permisos
                );
                break;
            case 'analista':
                usuario = new Analista(
                    userRow.id.toString(),
                    userRow.nombre,
                    userRow.apellido,
                    userRow.email,
                    userRow.password_hash,
                    userRow.telefono,
                    [] // permisos vacío o ajusta según tu lógica
                );
                break;
            case 'comerciante':
                // Obtener datos adicionales del comerciante
                const comercianteResult = await pool.query(
                    'SELECT * FROM comerciantes WHERE usuario_id = $1',
                    [userRow.id]
                );
                if (comercianteResult.rows.length === 0) {
                    throw new Error('Datos de comerciante no encontrados');
                }
                const comercianteRow = comercianteResult.rows[0];
                usuario = new Comerciante(
                    userRow.id.toString(),
                    userRow.nombre,
                    userRow.apellido,
                    userRow.email,
                    userRow.password_hash,
                    userRow.telefono,
                    comercianteRow.nombre_comercio,
                    comercianteRow.cuil,
                    comercianteRow.direccion_comercio,
                    [] // permisos vacío o ajusta según tu lógica
                );
                break;
            default:
                throw new Error('Rol no reconocido');
        }
        
        // Generar token
        const token = await this.generarToken(usuario);
        
        // Registrar sesión en la base de datos
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); // 1 hora de expiración
        
        await pool.query(
            `INSERT INTO sesiones (usuario_id, token, fecha_expiracion)
             VALUES ($1, $2, $3)`,
            [userRow.id, token, expirationDate]
        );
        
        return { usuario, token };
    }

    async logout(token: string): Promise<void> {
        // Inactivar la sesión en la base de datos
        await pool.query(
            'UPDATE sesiones SET activa = FALSE WHERE token = $1',
            [token]
        );
    }

    async register(usuario: Partial<Usuario>): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }

    async forgotPassword(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Validar token
        const payload = this.validarToken(token);
        if (!payload) {
            throw new Error('Token inválido o expirado');
        }
        
        // Hashear nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Actualizar contraseña en la base de datos
        await pool.query(
            'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
            [hashedPassword, payload.id]
        );
    }

    async changePassword(usuarioId: number, oldPassword: string, newPassword: string): Promise<void> {
        // Obtener usuario
        const userResult = await pool.query(
            'SELECT password_hash FROM usuarios WHERE id = $1',
            [usuarioId]
        );
        
        if (userResult.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        const user = userResult.rows[0];
        
        // Verificar contraseña actual
        const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!passwordMatch) {
            throw new Error('Contraseña actual incorrecta');
        }
        
        // Hashear nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Actualizar contraseña
        await pool.query(
            'UPDATE usuarios SET password_hash = $1 WHERE id = $2',
            [hashedPassword, usuarioId]
        );
    }
}