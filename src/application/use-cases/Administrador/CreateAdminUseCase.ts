// src/application/use-cases/Administrador/CreateAdminUseCase.ts
import { Administrador } from "../../../domain/entities/Administrador";
import { Permiso } from "../../../domain/entities/Permiso";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";
import bcrypt from 'bcrypt';

export class CreateAdminUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        telefono: string
    ): Promise<Administrador> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        // Crear instancia de Administrador (el id se generará en el repositorio)
        const administrador = new Administrador(
            0, // ID temporal (se asignará al guardar)
            nombre,
            apellido,
            email,
            passwordHash,
            telefono
        );

        // Guardar en el repositorio
        return this.repository.saveAdministrador(administrador);
    }
}