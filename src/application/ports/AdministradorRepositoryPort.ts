// src/application/ports/AdministradorRepositoryPort.ts
import { Administrador } from "../../domain/entities/Administrador";

export interface AdministradorRepositoryPort {
    saveAdministrador(administrador: Administrador): Promise<Administrador>;
    getAdministradorById(id: number): Promise<Administrador | null>;
    updateAdministrador(administrador: Administrador): Promise<Administrador>;
    deleteAdministrador(id: number): Promise<void>;
    getAllAdministradores(): Promise<Administrador[]>;
}