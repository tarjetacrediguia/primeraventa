// src/application/ports/AdministradorRepositoryPort.ts
import { Administrador } from "../../domain/entities/Administrador";

export interface AdministradorRepositoryPort {
    saveAdministrador(administrador: Administrador): Promise<Administrador>;
    getAdministradorById(id: string): Promise<Administrador | null>;
    updateAdministrador(administrador: Administrador): Promise<Administrador>;
    deleteAdministrador(id: string): Promise<void>;
    getAllAdministradores(): Promise<Administrador[]>;
}