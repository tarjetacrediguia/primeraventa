// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts
import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class UpdateComercianteUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    async execute(
        id: number,
        nombre: string,
        apellido: string,
        email: string,
        telefono: string,
        nombreComercio: string,
        cuil: string,
        direccionComercio: string,
        permisos: string[]
    ): Promise<Comerciante> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !telefono || 
            !nombreComercio || !cuil || !direccionComercio) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Validación de CUIL
        if (!this.validarCUIL(cuil)) {
            throw new Error("CUIL inválido");
        }

        // Obtener comerciante existente
        const existe = await this.repository.getComercianteById(id);
        if (!existe) {
            throw new Error("Comerciante no encontrado");
        }

        // Verificar CUIL único si cambió
        if (existe.getCuil() !== cuil) {
            const existeCuil = await this.repository.findByCuil(cuil);
            if (existeCuil) {
                throw new Error("Ya existe otro comerciante con este CUIL");
            }
        }

        // Crear instancia actualizada manteniendo password
        const comercianteActualizado = new Comerciante(
            id,
            nombre,
            apellido,
            email,
            existe.getPassword(), // Mantener password existente
            telefono,
            nombreComercio,
            cuil,
            direccionComercio,
            permisos
        );

        // Guardar cambios
        return this.repository.updateComerciante(comercianteActualizado);
    }

    private validarCUIL(cuil: string): boolean {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}