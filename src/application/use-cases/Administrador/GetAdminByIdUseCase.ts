// src/application/use-cases/Administrador/GetAdminByIdUseCase.ts
import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

export class GetAdminByIdUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(id: string): Promise<Administrador> {
        const administrador = await this.repository.getAdministradorById(id);
        
        if (!administrador) {
            throw new Error("Administrador no encontrado");
        }
        
        return administrador;
    }
}