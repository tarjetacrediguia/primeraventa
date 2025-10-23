// src/application/use-cases/Tasas/ObtenerTasaActivaPorCodigoUseCase.ts

import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class ObtenerTasaActivaPorCodigoUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(codigo: string): Promise<{ valor: number; descripcion: string } | null> {
        if (!codigo || codigo.trim() === '') {
            throw new Error('El código de tasa es requerido');
        }
        
        const tasa = await this.repository.findTasaActivaByCodigo(codigo);
        
        if (!tasa) {
            throw new Error(`Tasa con código ${codigo} no encontrada en el conjunto activo`);
        }
        
        return tasa;
    }
}