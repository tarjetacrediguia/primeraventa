// src/application/use-cases/Permisos/ObtenerPermisosUsuarioUseCase.ts
import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class ObtenerPermisosUsuarioUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(usuarioId: number): Promise<Permiso[]> {
        if (!usuarioId) {
            throw new Error("Usuario es obligatorio");
        }
        
        return this.repository.getPermisosUsuario(usuarioId);
    }
}
