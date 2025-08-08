// src/application/use-cases/tasas/CreateConjuntoTasasUseCase.ts

import { ConjuntoTasas } from "../../../domain/entities/ConjuntoTasas";
import { TasasRepositoryPort } from "../../ports/TasasRepositoryPort";

export class CreateConjuntoTasasUseCase {
    constructor(private repository: TasasRepositoryPort) {}
    
    async execute(
        nombre: string,
        descripcion: string,
        activo: boolean,
        tasas: Map<string, { valor: number; descripcion: string }> = new Map()
    ): Promise<ConjuntoTasas> {
        if (!nombre) throw new Error("El nombre es obligatorio");
        
        // Crear instancia temporal
        const conjunto = new ConjuntoTasas(
            0, // ID temporal
            nombre,
            descripcion,
            new Date(), // Fecha creación (se sobreescribirá)
            new Date(), // Fecha actualización (se sobreescribirá)
            activo
        );
        
        // Agregar tasas al conjunto
        tasas.forEach((tasaData, codigo) => {
            conjunto.agregarTasa(codigo, tasaData.valor, tasaData.descripcion);
        });
        
        // Guardar en el repositorio
        const created = await this.repository.createConjuntoTasas(conjunto);
        
        // Activar si es necesario
        if (activo) {
            await this.repository.activateConjuntoTasas(created.id);
        }
        
        return created;
    }
}