// src/application/ports/AuthPort.ts
import { Usuario } from "../../domain/entities/Usuario";

export interface AuthPort {
    generarToken(usuario: Usuario): Promise<string>;
    validarToken(token: string): { id: string; rol: string } | null;
    login(email: string, password: string): Promise<{ usuario: Usuario, token: string }>;
    logout(token: string): Promise<void>;
    register(usuario: Partial<Usuario>): Promise<Usuario>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    changePassword(usuarioId: number, oldPassword: string, newPassword: string): Promise<void>;
    changePassword(usuarioId: string, oldPassword: string, newPassword: string): Promise<void>;
}