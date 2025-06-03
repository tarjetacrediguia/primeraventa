//src/infrastructure/adapters/authorization/AuthAdapter.ts

import { AuthPort } from "../../../application/ports/AuthPort";
import { Usuario } from "../../../domain/entities/Usuario";

export class AuthAdapter implements AuthPort {
    generarToken(usuario: Usuario): string {
        throw new Error("Method not implemented.");
    }
    validarToken(token: string): { id: string; rol: string; } | null {
        throw new Error("Method not implemented.");
    }
    login(email: string, password: string): Promise<{ usuario: Usuario; token: string; }> {
        throw new Error("Method not implemented.");
    }
    logout(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    register(usuario: Partial<Usuario>): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }
    forgotPassword(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resetPassword(token: string, newPassword: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    changePassword(usuarioId: string, oldPassword: string, newPassword: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
  
}