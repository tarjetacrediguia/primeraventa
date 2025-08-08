// src/application/use-cases/Compra/ObtenerComprasPorEstadoUseCase.ts
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";

export class ObtenerComprasPorEstadoUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    async execute(estado: EstadoCompra): Promise<Compra[]> {
        // Validar estado
        if (!Object.values(EstadoCompra).includes(estado)) {
            throw new Error(`Estado de compra inválido: ${estado}`);
        }

        // Obtener compras
        return this.compraRepository.getComprasByEstado(estado);
    }
}