// src/application/use-cases/Permisos/AsignarPermisoUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Permiso } from "../../../domain/entities/Permiso";

export class AsignarPermisoUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(
        usuarioId: number,
        permisos: string[] // Ahora solo nombres de permisos
    ): Promise<Usuario> {
        // Validaciones básicas
        if (!usuarioId || !permisos || permisos.length === 0) {
            throw new Error("Usuario y permisos son obligatorios");
        }

        // Obtener todos los permisos válidos del sistema
        const permisosValidos: Permiso[] = await this.repository.getAllPermisos();
        
        // Extraer solo los nombres de los permisos válidos
        const nombresPermisosValidos = permisosValidos.map(p => p.nombre);
        
        // Verificar que todos los permisos a asignar sean válidos
        const permisosInvalidos = permisos.filter(
            p => !nombresPermisosValidos.includes(p)
        );
        
        if (permisosInvalidos.length > 0) {
            throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
        }

        return this.repository.asignarPermisos(usuarioId, permisos);
    }
}