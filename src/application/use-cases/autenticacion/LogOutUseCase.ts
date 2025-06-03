// src/application/use-cases/autenticacion/LogOutUseCase.ts
import { AuthPort } from "../../ports/AuthPort";

export class LogOutUseCase {
    constructor(private readonly authPort: AuthPort) {}

    async execute(token: string): Promise<void> {
        if (!token) {
            throw new Error("Token es requerido para cerrar sesión");
        }

        await this.authPort.logout(token);
    }
}