// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class UpdateAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(
        id: string,
        nombre: string,
        apellido: string,
        email: string,
        telefono: string,
        permisos: string[]
    ): Promise<Analista> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !telefono || !permisos) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Obtener analista existente
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }

        // Crear instancia actualizada manteniendo password
        const analistaActualizado = new Analista(
            id,
            nombre,
            apellido,
            email,
            existe.getPassword(), // Mantener password existente
            telefono,
            permisos
        );

        // Guardar cambios
        return this.repository.updateAnalista(analistaActualizado);
    }
}