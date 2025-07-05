// src/application/use-cases/autenticacion/ResetPwdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Restablecer Contraseña
 *
 * Este módulo implementa la lógica de negocio para el restablecimiento de la contraseña
 * de un usuario, validando el token y la nueva contraseña.
 *
 * RESPONSABILIDADES:
 * - Validar el token de restablecimiento
 * - Validar la nueva contraseña
 * - Restablecer la contraseña del usuario
 */

import { AuthPort } from "../../ports/AuthPort";

/**
 * Caso de uso para el restablecimiento de contraseña de usuario.
 *
 * Esta clase permite validar el token y la nueva contraseña,
 * y delega el cambio al puerto de autenticación.
 */
export class ResetPwdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param authPort - Puerto de autenticación
     */
    constructor(private readonly authPort: AuthPort) {}

    /**
     * Ejecuta el proceso de restablecimiento de contraseña.
     *
     * @param token - Token de restablecimiento de contraseña
     * @param newPassword - Nueva contraseña a establecer
     * @returns Promise<void>
     * @throws Error si faltan datos o la contraseña no cumple requisitos
     */
    async execute(token: string, newPassword: string): Promise<void> {
        // Validaciones básicas
        if (!token || !newPassword) {
            throw new Error("Token y nueva contraseña son obligatorios");
        }

        if (newPassword.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        await this.authPort.resetPassword(token, newPassword);
    }
}
