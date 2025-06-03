// src/application/use-cases/Administrador/DeleteAdminUseCase.ts
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

export class DeleteAdminUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(id: string): Promise<void> {
        // Verificar existencia antes de eliminar
        const existe = await this.repository.getAdministradorById(id);
        if (!existe) {
            throw new Error("Administrador no encontrado");
        }
        
        return this.repository.deleteAdministrador(id);
    }
}