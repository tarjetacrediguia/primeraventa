// src/application/use-cases/Comerciante/DeleteComercianteUseCase.ts
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class DeleteComercianteUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    async execute(id: string): Promise<void> {
        // Verificar existencia
        const existe = await this.repository.getComercianteById(id);
        if (!existe) {
            throw new Error("Comerciante no encontrado");
        }
        
        return this.repository.deleteComerciante(id);
    }
}