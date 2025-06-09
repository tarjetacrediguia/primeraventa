// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class UpdateAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(
        id: number,
        datos: {
            nombre?: string;
            apellido?: string;
            email?: string;
            telefono?: string;
            permisos?: string[];
        }
    ): Promise<Analista> {
        // Verificar existencia
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }

        // Crear objeto con datos actualizados
        const analistaActualizado = new Analista(
            id,
            datos.nombre || existe.getNombre(),
            datos.apellido || existe.getApellido(),
            datos.email || existe.getEmail(),
            existe.getPassword(), // No permitimos actualizar la contraseña aquí
            datos.telefono || existe.getTelefono(),
            datos.permisos || existe.getPermisos()
        );

        return this.repository.updateAnalista(analistaActualizado);
    }
}