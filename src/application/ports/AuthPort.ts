// src/application/ports/AuthPort.ts

/**
 * MÓDULO: Puerto de Autenticación
 *
 * Este módulo define la interfaz para el puerto de autenticación que permite
 * gestionar la autenticación y autorización de usuarios en el sistema.
 *
 * RESPONSABILIDADES:
 * - Generar y validar tokens de autenticación
 * - Gestionar el proceso de login y logout
 * - Manejar el registro de usuarios
 * - Administrar el restablecimiento de contraseñas
 */

import { Usuario } from "../../domain/entities/Usuario";

/**
 * Puerto para operaciones de autenticación y autorización.
 *
 * Esta interfaz define los métodos necesarios para gestionar la autenticación
 * de usuarios, incluyendo generación de tokens, validación y gestión de sesiones.
 */
export interface AuthPort {
    /**
     * Genera un token de autenticación para un usuario.
     *
     * @param usuario - Usuario para el cual generar el token
     * @returns Promise<string> - Token de autenticación generado
     */
    generarToken(usuario: Usuario): Promise<string>;

    /**
     * Valida un token de autenticación y retorna la información del usuario.
     *
     * @param token - Token a validar
     * @returns { id: string; rol: string } | null - Información del usuario si es válido, null si no
     */
    validarToken(token: string): { id: string; rol: string } | null;

    /**
     * Autentica un usuario con email y contraseña.
     *
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña del usuario
     * @returns Promise<{ usuario: Usuario, token: string }> - Usuario autenticado y token
     * @throws Error si las credenciales son inválidas
     */
    login(email: string, password: string): Promise<{ usuario: Usuario, token: string }>;

    /**
     * Cierra la sesión de un usuario invalidando su token.
     *
     * @param token - Token a invalidar
     * @returns Promise<void>
     */
    logout(token: string): Promise<void>;

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param usuario - Datos del usuario a registrar
     * @returns Promise<Usuario> - Usuario registrado
     * @throws Error si el usuario ya existe o los datos son inválidos
     */
    register(usuario: Partial<Usuario>): Promise<Usuario>;

    /**
     * Inicia el proceso de restablecimiento de contraseña.
     *
     * @param email - Correo electrónico del usuario
     * @returns Promise<void>
     * @throws Error si el email no existe
     */
    forgotPassword(email: string): Promise<void>;

    /**
     * Restablece la contraseña de un usuario usando un token.
     *
     * @param token - Token de restablecimiento
     * @param newPassword - Nueva contraseña
     * @returns Promise<void>
     * @throws Error si el token es inválido o ha expirado
     */
    resetPassword(token: string, newPassword: string): Promise<void>;

    /**
     * Cambia la contraseña de un usuario autenticado.
     *
     * @param usuarioId - ID del usuario
     * @param oldPassword - Contraseña actual
     * @param newPassword - Nueva contraseña
     * @returns Promise<void>
     * @throws Error si la contraseña actual es incorrecta
     */
    changePassword(usuarioId: number, oldPassword: string, newPassword: string): Promise<void>;
}
