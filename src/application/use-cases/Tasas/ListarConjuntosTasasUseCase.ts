// src/application/use-cases/Tasas/ListarConjuntosTasasUseCase.ts

import { ConjuntoTasas } from "../../../domain/entities/ConjuntoTasas";
import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class ListarConjuntosTasasUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(): Promise<ConjuntoTasas[]> {
        return this.repository.findAllConjuntosTasas();
    }
}