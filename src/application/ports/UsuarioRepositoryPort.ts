// src/application/ports/UsuarioRepository.ts
import { Usuario } from "../../domain/entities/Usuario";

export interface UsuarioRepositoryPort {
    saveUsuario(usuario: Usuario): Promise<Usuario>;
    getUsuarioById(id: number): Promise<Usuario | null>;
    updateUsuario(usuario: Usuario): Promise<Usuario>;
    deleteUsuario(id: number): Promise<void>;
    getAllUsuarios(): Promise<Usuario[]>;
    getUsuariosByEmail(email: string): Promise<Usuario[]>;
    getUsuarioByEmail(email: string): Promise<Usuario | null>;
    getUsuariosByRol(rol: string): Promise<Usuario[]>;
}