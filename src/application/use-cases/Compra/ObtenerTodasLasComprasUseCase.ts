// src/application/use-cases/Compra/ObtenerTodasLasComprasUseCase.ts

import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

export class ObtenerTodasLasComprasUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    async execute(): Promise<any[]> {
        // Implementación para obtener todas las compras
        return this.compraRepository.getAllCompras();
    }
}

