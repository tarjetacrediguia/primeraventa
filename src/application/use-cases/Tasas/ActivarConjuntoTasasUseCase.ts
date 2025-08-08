// src/application/use-cases/Tasas/ActivarConjuntoTasasUseCase.ts

import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class ActivarConjuntoTasasUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(id: number): Promise<void> {
        const conjunto = await this.repository.findConjuntoTasasById(id);
        if (!conjunto) throw new Error("Conjunto de tasas no encontrado");
        
        // Verificar si el conjunto ya está activo
        if (conjunto.activo) return;
        
        // Activar el conjunto
        await this.repository.activateConjuntoTasas(id);
    }
}