// src/application/use-cases/Permisos/VerificarPermisoUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class VerificarPermisoUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(usuarioId: number, permiso: string): Promise<boolean> {
        if (!usuarioId || !permiso) {
            throw new Error("Usuario y permiso son obligatorios");
        }
        
        return this.repository.usuarioTienePermiso(usuarioId, permiso);
    }
}
