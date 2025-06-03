//src/infraestructure/adapters/repository/UsuarioRepositoryAdapter.ts

import { UsuarioRepositoryPort } from "../../../application/ports/UsuarioRepositoryPort";
import { Usuario } from "../../../domain/entities/Usuario";

export class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {
    saveUsuario(usuario: Usuario): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }
    getUsuarioById(id: string): Promise<Usuario | null> {
        throw new Error("Method not implemented.");
    }
    updateUsuario(usuario: Usuario): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }
    deleteUsuario(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAllUsuarios(): Promise<Usuario[]> {
        throw new Error("Method not implemented.");
    }
    getUsuariosByEmail(email: string): Promise<Usuario[]> {
        throw new Error("Method not implemented.");
    }
    getUsuarioByEmail(email: string): Promise<Usuario | null> {
        throw new Error("Method not implemented.");
    }
    getUsuariosByRol(rol: string): Promise<Usuario[]> {
        throw new Error("Method not implemented.");
    }
    
}