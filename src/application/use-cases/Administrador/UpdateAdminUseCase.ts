// src/application/use-cases/Administrador/UpdateAdminUseCase.ts
import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

export class UpdateAdminUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(
        id: string,
        nombre: string,
        apellido: string,
        email: string,
        telefono: string,
        permisos: string[]
    ): Promise<Administrador> {
        // Validaciones básicas
        if (!nombre || !apellido || !email || !telefono || !permisos) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Obtener administrador existente
        const existe = await this.repository.getAdministradorById(id);
        if (!existe) {
            throw new Error("Administrador no encontrado");
        }

        // Crear instancia actualizada
        const administradorActualizado = new Administrador(
            id,
            nombre,
            apellido,
            email,
            existe.getPassword(), // Mantener password existente
            telefono,
            permisos
        );

        // Guardar cambios
        return this.repository.updateAdministrador(administradorActualizado);
    }
}