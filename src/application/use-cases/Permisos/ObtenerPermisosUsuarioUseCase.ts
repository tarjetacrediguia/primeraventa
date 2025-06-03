// src/application/use-cases/Permisos/ObtenerPermisosUsuarioUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class ObtenerPermisosUsuarioUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(usuarioId: string): Promise<string[]> {
        if (!usuarioId) {
            throw new Error("Usuario es obligatorio");
        }
        
        return this.repository.getPermisosUsuario(usuarioId);
    }
}