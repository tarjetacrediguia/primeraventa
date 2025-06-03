// src/application/ports/UsuarioRepository.ts
import { Usuario } from "../../domain/entities/Usuario";

export interface UsuarioRepositoryPort {
    saveUsuario(usuario: Usuario): Promise<Usuario>;
    getUsuarioById(id: string): Promise<Usuario | null>;
    updateUsuario(usuario: Usuario): Promise<Usuario>;
    deleteUsuario(id: string): Promise<void>;
    getAllUsuarios(): Promise<Usuario[]>;
    getUsuariosByEmail(email: string): Promise<Usuario[]>;
    getUsuarioByEmail(email: string): Promise<Usuario | null>;
    getUsuariosByRol(rol: string): Promise<Usuario[]>;
}