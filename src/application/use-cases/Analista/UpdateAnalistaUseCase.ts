// src/application/use-cases/Analista/UpdateAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class UpdateAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(
        id: number,
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
        // Verificar existencia
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }

        // Crear objeto con datos actualizados
        const analistaActualizado = new Analista(
            id,
            nombre || existe.getNombre(),
            apellido || existe.getApellido(),
            email || existe.getEmail(),
            existe.getPassword(), // No permitimos actualizar la contraseña aquí
            telefono || existe.getTelefono(),
            permisos || existe.getPermisos()
        );

        return this.repository.updateAnalista(analistaActualizado);
    }
}