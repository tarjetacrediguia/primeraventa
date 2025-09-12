// src/application/use-cases/Compra/ObtenerCompraPorSolicitudFormalUseCase.ts
import { Compra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

export class ObtenerCompraPorSolicitudFormalUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    async execute(solicitudFormalId: number, usuarioId?: number, usuarioRol?: string): Promise<any> {
        const compra = await this.compraRepository.getComprasBySolicitudFormalId(solicitudFormalId);
        
        // Solo verificar permisos si es comerciante
        if (usuarioRol === 'comerciante' && compra.comercianteId !== usuarioId) {
            throw new Error('No tienes permiso para acceder a esta compra');
        }

        return compra;
    }
}