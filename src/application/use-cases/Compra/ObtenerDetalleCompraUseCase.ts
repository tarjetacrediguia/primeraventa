// src/application/use-cases/Compra/ObtenerDetalleCompraUseCase.ts
import { Compra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

export class ObtenerDetalleCompraUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    async execute(id: number): Promise<Compra> {
        // Obtener compra con sus items
        const compra = await this.compraRepository.getCompraById(id);
        
        if (!compra) {
            throw new Error(`No existe una compra con ID: ${id}`);
        }

        return compra;
    }
}