// src/application/use-cases/Analista/DeleteAnalistaUseCase.ts
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class DeleteAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(id: string): Promise<void> {
        // Verificar existencia
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }
        
        return this.repository.deleteAnalista(id);
    }
}