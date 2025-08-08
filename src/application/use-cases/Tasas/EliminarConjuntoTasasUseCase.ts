// src/application/use-cases/Tasas/EliminarConjuntoTasasUseCase.ts

import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class EliminarConjuntoTasasUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(id: number): Promise<void> {
        const conjunto = await this.repository.findConjuntoTasasById(id);
        if (!conjunto) throw new Error("Conjunto de tasas no encontrado");
        if (conjunto.activo) throw new Error("No se puede eliminar un conjunto activo");
        
        await this.repository.deleteConjuntoTasas(id);
    }
}