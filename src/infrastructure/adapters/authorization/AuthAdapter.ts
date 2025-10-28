// src/infrastructure/adapters/authorization/AuthAdapter.ts

/**
 * MÓDULO: Adaptador de Autenticación y Autorización
 *
 * Este archivo implementa el adaptador para la gestión de autenticación y autorización
 * del sistema, proporcionando funcionalidades de login, logout, gestión de tokens JWT
 * y manejo de contraseñas seguras.
 * 
 * Responsabilidades:
 * - Autenticación de usuarios con validación de credenciales
 * - Generación y validación de tokens JWT
 * - Gestión de sesiones de usuario
 * - Manejo seguro de contraseñas con bcrypt
 * - Registro y recuperación de contraseñas
 * - Creación de usuarios según roles específicos
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */

import { AuthPort } from "../../../application/ports/AuthPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Administrador } from "../../../domain/entities/Administrador";
import { Analista } from "../../../domain/entities/Analista";
import { Comerciante } from "../../../domain/entities/Comerciante";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../../config/Database/DatabaseDonfig";
import { QueryResult } from 'pg';
import { Comercio } from "../../../domain/entities/Comercio";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'kjhskdf65454sdfkhvxtu_clave_secreta_muy_segura';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Adaptador que implementa la autenticación y autorización del sistema.
 * Proporciona métodos para login, logout, gestión de tokens JWT y manejo
 * seguro de contraseñas con diferentes roles de usuario.
 */
export class AuthAdapter implements AuthPort {
    
    /**
     * Genera un token JWT para un usuario autenticado.
     * El token incluye información del usuario (ID, email y rol) y expira en 1 hora.
     * 
     * @param usuario - Objeto Usuario para el cual generar el token.
     * @returns Promise<string> - Token JWT generado.
     */
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

    /**
     * Valida un token JWT y extrae la información del usuario.
     * Verifica la firma del token y su expiración.
     * 
     * @param token - Token JWT a validar.
     * @returns { id: string; rol: string } | null - Información del usuario o null si el token es inválido.
     */
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

    /**
     * Autentica un usuario con email y contraseña.
     * Valida las credenciales, crea la instancia de usuario según su rol,
     * genera un token JWT y registra la sesión en la base de datos.
     * 
     * @param email - Email del usuario.
     * @param password - Contraseña del usuario.
     * @returns Promise<{ usuario: Usuario; token: string }> - Usuario autenticado y token JWT.
     * @throws Error si las credenciales son inválidas o el rol no es reconocido.
     */
    async login(email: string, password: string): Promise<{ usuario: Usuario; token: string }> {
        // Buscar usuario por email
        const userResult: QueryResult = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        if (userResult.rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }
        
        
        const userRow = userResult.rows[0];
        const saltRounds = 10;
        const passwordMatch = await bcrypt.compare(password, userRow.password_hash);
        
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
        usuario = new Administrador({
            id: userRow.id.toString(),
            nombre: userRow.nombre,
            apellido: userRow.apellido,
            email: userRow.email,
            password: userRow.password_hash,
            telefono: userRow.telefono,
            permisos: permisos
        });
                break;
            case 'analista':
                usuario = new Analista({
                    id: userRow.id.toString(),
                    nombre: userRow.nombre,
                    apellido: userRow.apellido,
                    email: userRow.email,
                    password: userRow.password_hash,
                    telefono: userRow.telefono,
                    permisos: [] // permisos vacío o ajusta según tu lógica
                });
                break;
            case 'comerciante':
                // Obtener datos adicionales del comerciante
                const comercianteResult = await pool.query(
                    `SELECT c.numero_comercio, co.nombre_comercio, co.cuil, co.direccion_comercio
                     FROM comerciantes c
                     INNER JOIN comercios co ON c.numero_comercio = co.numero_comercio
                     WHERE c.usuario_id = $1`,
                    [userRow.id]
                );
                if (comercianteResult.rows.length === 0) {
                    throw new Error('Datos de comerciante no encontrados');
                }
                const comercioRow  = comercianteResult.rows[0];

                const comercio = new Comercio({
                    numeroComercio: comercioRow.numero_comercio,
                    nombreComercio: comercioRow.nombre_comercio,
                    cuil: comercioRow.cuil,
                    direccionComercio: comercioRow.direccion_comercio
                });
                usuario = new Comerciante({
                    id: userRow.id.toString(),
                    nombre: userRow.nombre,
                    apellido: userRow.apellido,
                    email: userRow.email,
                    password: userRow.password_hash,
                    telefono: userRow.telefono,
                    comercio: comercio,
                    permisos: [] // permisos vacío o ajusta según tu lógica
                });
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

    /**
     * Cierra la sesión de un usuario invalidando su token.
     * Marca la sesión como inactiva en la base de datos.
     * 
     * @param token - Token JWT de la sesión a cerrar.
     * @returns Promise<void> - No retorna valor.
     */
    async logout(token: string): Promise<void> {
        // Inactivar la sesión en la base de datos
        await pool.query(
            'UPDATE sesiones SET activa = FALSE WHERE token = $1',
            [token]
        );
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param usuario - Datos del usuario a registrar.
     * @returns Promise<Usuario> - El usuario registrado.
     */
    async register(usuario: Partial<Usuario>): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }

    /**
     * Inicia el proceso de recuperación de contraseña para un usuario.
     * 
     * @param email - Email del usuario que solicita recuperar su contraseña.
     * @returns Promise<void> - No retorna valor.
     */
    async forgotPassword(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Restablece la contraseña de un usuario usando un token de recuperación.
     * Valida el token y actualiza la contraseña en la base de datos.
     * 
     * @param token - Token de recuperación de contraseña.
     * @param newPassword - Nueva contraseña del usuario.
     * @returns Promise<void> - No retorna valor.
     * @throws Error si el token es inválido o ha expirado.
     */
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

    /**
     * Cambia la contraseña de un usuario verificando la contraseña actual.
     * Valida la contraseña actual antes de permitir el cambio.
     * 
     * @param usuarioId - ID del usuario que cambia su contraseña.
     * @param oldPassword - Contraseña actual del usuario.
     * @param newPassword - Nueva contraseña del usuario.
     * @returns Promise<void> - No retorna valor.
     * @throws Error si el usuario no existe o la contraseña actual es incorrecta.
     */
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
