// src/application/use-cases/tasas/AgregarTasaAConjuntoUseCase.ts

import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class AgregarTasaAConjuntoUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(
        conjuntoId: number,
        codigo: string,
        valor: number,
        descripcion: string = ""
    ): Promise<void> {
        if (!codigo) throw new Error("El código es obligatorio");
        
        await this.repository.agregarTasaAConjunto(
            conjuntoId,
            codigo,
            valor,
            descripcion
        );
    }
}