// src/application/use-cases/Permisos/ListPermisosUseCase.ts
import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class ListPermisosUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(): Promise<Permiso[]> {
        const permisos = await this.repository.getAllPermisos();
        return permisos;
    }
}
