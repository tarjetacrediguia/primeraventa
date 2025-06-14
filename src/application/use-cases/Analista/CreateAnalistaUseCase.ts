// src/application/use-cases/Analista/CreateAnalistaUseCase.ts
import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import bcrypt from 'bcrypt';

export class CreateAnalistaUseCase {
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string
    ): Promise<Analista> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Crear instancia de Analista (el id se generará en el repositorio)
        const analista = new Analista(
            0, // ID temporal (se asignará al guardar)
            nombre,
            apellido,
            email,
            passwordHash,
            telefono
        );

        // Guardar en el repositorio
        return this.repository.saveAnalista(analista);
    }
}