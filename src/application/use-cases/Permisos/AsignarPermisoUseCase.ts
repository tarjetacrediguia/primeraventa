// src/application/use-cases/Permisos/AsignarPermisoUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { Usuario } from "../../../domain/entities/Usuario";

export class AsignarPermisoUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(
        usuarioId: string,
        permisos: string[]
    ): Promise<Usuario> {
        // Validaciones básicas
        if (!usuarioId || !permisos || permisos.length === 0) {
            throw new Error("Usuario y permisos son obligatorios");
        }

        // Obtener todos los permisos válidos del sistema
        const permisosValidos = await this.repository.getAllPermisos();
        
        // Verificar que todos los permisos a asignar sean válidos
        const permisosInvalidos = permisos.filter(p => !permisosValidos.includes(p));
        if (permisosInvalidos.length > 0) {
            throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
        }

        return this.repository.asignarPermisos(usuarioId, permisos);
    }
}