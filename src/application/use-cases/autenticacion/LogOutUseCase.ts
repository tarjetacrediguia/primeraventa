// src/application/use-cases/autenticacion/LogOutUseCase.ts

/**
 * MÓDULO: Caso de Uso - Logout de Usuario
 *
 * Este módulo implementa la lógica de negocio para cerrar la sesión de un usuario
 * en el sistema, invalidando el token de autenticación.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia del token
 * - Invalidar el token de sesión
 */

import { AuthPort } from "../../ports/AuthPort";

/**
 * Caso de uso para el cierre de sesión de usuarios.
 *
 * Esta clase permite invalidar el token de sesión de un usuario,
 * cerrando su sesión en el sistema.
 */
export class LogOutUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param authPort - Puerto de autenticación
     */
    constructor(private readonly authPort: AuthPort) {}

    /**
     * Ejecuta el proceso de logout de usuario.
     *
     * @param token - Token de autenticación a invalidar
     * @returns Promise<void>
     * @throws Error si no se proporciona el token
     */
    async execute(token: string): Promise<void> {
        if (!token) {
            throw new Error("Token es requerido para cerrar sesión");
        }

        await this.authPort.logout(token);
    }
}
