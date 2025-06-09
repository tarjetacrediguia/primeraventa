// src/application/use-cases/Analista/CreateAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

export class CreateAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string,
        permisos: string[]
    ): Promise<Analista> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Crear instancia de Analista (el id se generará en el repositorio)
        const analista = new Analista(
            0, // ID temporal (se asignará al guardar)
            nombre,
            apellido,
            email,
            password,
            telefono,
            permisos
        );

        // Guardar en el repositorio
        return this.repository.saveAnalista(analista);
    }
}