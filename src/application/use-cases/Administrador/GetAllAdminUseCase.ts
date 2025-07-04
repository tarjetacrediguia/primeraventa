// src/application/use-cases/Administrador/GetAllAdminUseCase.ts
import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

export class GetAllAdminUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(): Promise<Administrador[]> {
        return this.repository.getAllAdministradores();
    }
}
