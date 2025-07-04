// src/application/use-cases/Comerciante/UpdateComercianteUseCase.ts
import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

export class UpdateComercianteUseCase {
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    async execute(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string,
        nombreComercio: string,
        cuil: string,
        direccionComercio: string
    ): Promise<Comerciante> {
        // Verificar existencia
        const existe = await this.repository.getComercianteById(id);
        if (!existe) {
            throw new Error("Comerciante no encontrado");
        }

        // Crear objeto con datos actualizados
        const comercianteActualizado = new Comerciante(
            id,
            nombre || existe.getNombre(),
            apellido || existe.getApellido(),
            existe.getEmail(),
            existe.getPassword(), // No permitimos actualizar la contraseña aquí
            telefono || existe.getTelefono(),
            nombreComercio || existe.getNombreComercio(),
            cuil || existe.getCuil(),
            direccionComercio || existe.getDireccionComercio(),
            existe.getPermisos()
        );

        return this.repository.updateComerciante(comercianteActualizado);
    }

    private validarCUIL(cuil: string): boolean {
        // Implementación básica de validación de CUIL
        return /^\d{2}-\d{8}-\d{1}$/.test(cuil);
    }
}
