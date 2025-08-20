// src/application/use-cases/Compra/ObtenerComprasPorComercianteUseCase.ts
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

export class ObtenerComprasPorComercianteUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    async execute(comercianteId: number): Promise<any[]> {
        return this.compraRepository.getComprasByComerciante(comercianteId);
    }
}