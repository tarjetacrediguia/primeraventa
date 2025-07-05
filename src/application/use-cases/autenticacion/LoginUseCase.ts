// src/application/use-cases/autenticacion/LoginUseCase.ts

/**
 * MÓDULO: Caso de Uso - Login de Usuario
 *
 * Este módulo implementa la lógica de negocio para la autenticación de usuarios
 * en el sistema, validando credenciales y generando el token de sesión.
 *
 * RESPONSABILIDADES:
 * - Validar credenciales de acceso
 * - Autenticar usuarios de diferentes roles
 * - Generar y retornar el token de sesión
 */

import { AuthPort } from "../../ports/AuthPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Administrador } from "../../../domain/entities/Administrador";
import { Analista } from "../../../domain/entities/Analista";
import { Comerciante } from "../../../domain/entities/Comerciante";

/**
 * Caso de uso para el inicio de sesión de usuarios.
 *
 * Esta clase permite autenticar usuarios, validando sus credenciales y
 * determinando su rol en el sistema.
 */
export class LoginUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param authPort - Puerto de autenticación
     */
    constructor(private readonly authPort: AuthPort) {}

    /**
     * Ejecuta el proceso de login de usuario.
     *
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña en texto plano
     * @returns Promise<{ usuario: Usuario, token: string, rol: string }> - Usuario autenticado, token de sesión y rol
     * @throws Error si faltan credenciales o la autenticación falla
     */
    async execute(email: string, password: string): Promise<{ usuario: Usuario, token: string, rol: string }> {
        // Validaciones básicas
        if (!email || !password) {
            throw new Error("Email y contraseña son obligatorios");
        }

        // Autenticar al usuario
        const result = await this.authPort.login(email, password);
        
        // Determinar el rol del usuario
        let rol = "usuario";
        if (result.usuario instanceof Administrador) rol = "administrador";
        else if (result.usuario instanceof Analista) rol = "analista";
        else if (result.usuario instanceof Comerciante) rol = "comerciante";
        // Agregar otros roles según sea necesario
        
        return {
            usuario: result.usuario,
            token: result.token,
            rol
        };
    }
}
