// src/application/use-cases/tasas/UpdateConjuntoTasasUseCase.ts

import { ConjuntoTasas } from "../../../domain/entities/ConjuntoTasas";
import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class UpdateConjuntoTasasUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(
        id: number,
        nombre: string,
        descripcion: string,
        activo: boolean,
        tasas: Map<string, { valor: number; descripcion: string }> = new Map()
    ): Promise<ConjuntoTasas> {
        // Obtener conjunto existente
        const existing = await this.repository.findConjuntoTasasById(id);
        if (!existing) throw new Error("Conjunto de tasas no encontrado");
        
        // Actualizar propiedades
        existing.nombre = nombre;
        existing.descripcion = descripcion;
        existing.activo = activo;
        
        // Actualizar tasas (limpiar y agregar nuevas)
        existing.tasas.clear();
        tasas.forEach((tasaData, codigo) => {
            existing.agregarTasa(codigo, tasaData.valor, tasaData.descripcion);
        });
        
        // Guardar cambios
        const updated = await this.repository.updateConjuntoTasas(existing);
        
        // Activar si es necesario
        if (activo) {
            await this.repository.activateConjuntoTasas(id);
        }
        
        return updated;
    }
}