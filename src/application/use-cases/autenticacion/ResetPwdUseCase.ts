// src/application/use-cases/autenticacion/ResetPwdUseCase.ts
import { AuthPort } from "../../ports/AuthPort";

export class ResetPwdUseCase {
    constructor(private readonly authPort: AuthPort) {}

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
