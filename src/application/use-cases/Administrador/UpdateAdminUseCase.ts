// src/application/use-cases/Administrador/UpdateAdminUseCase.ts
import { Administrador } from "../../../domain/entities/Administrador";
import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

export class UpdateAdminUseCase {
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    async execute(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string
    ): Promise<Administrador> {
        // Validaciones básicas
        if (!nombre || !apellido || !telefono) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Obtener administrador existente
        const existe = await this.repository.getAdministradorById(id);
        if (!existe) {
            throw new Error("Administrador no encontrado");
        }

        // Crear instancia actualizada
        const administradorActualizado = new Administrador(
            Number(id),
            nombre,
            apellido,
            existe.getEmail(), // Mantener email existente
            existe.getPassword(), // Mantener password existente
            telefono,
            existe.getPermisos() // Mantener permisos existentes
        );

        // Guardar cambios
        return this.repository.updateAdministrador(administradorActualizado);
    }
}
