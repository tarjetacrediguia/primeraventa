// src/application/use-cases/Permisos/CreatePermisoUseCase.ts
import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class CreatePermisoUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(
        nombre: string,
        descripcion: string
    ): Promise<Permiso> {
        // Validaciones básicas
        if (!nombre || !descripcion) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Validar formato del nombre del permiso
        if (!/^[a-z_]+$/.test(nombre)) {
            throw new Error("El nombre del permiso solo puede contener letras minúsculas y guiones bajos");
        }

        return this.repository.crearPermiso(nombre, descripcion);
    }
}