// src/application/use-cases/Permisos/AsignarPermisosRolUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { Permiso } from "../../../domain/entities/Permiso";

export class AsignarPermisosRolUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(rol: string, permisos: string[]): Promise<void> {
        const rolesValidos = ['administrador', 'analista', 'comerciante'];
        if (!rolesValidos.includes(rol)) {
            throw new Error(`Rol inválido: ${rol}`);
        }
        
        const permisosValidos: Permiso[] = await this.repository.getAllPermisos();
        console.log('Permisos válidos:', permisosValidos);
        // Extraer solo los nombres de los permisos válidos
        const nombresPermisosValidos = permisosValidos.map(p => p.nombre);
        console.log('Nombres de permisos válidos:', nombresPermisosValidos);
        const permisosInvalidos = permisos.filter(
            p => !nombresPermisosValidos.includes(p)
        );
        console.log('Permisos inválidos:', permisosInvalidos);
        if (permisosInvalidos.length > 0) {
            throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
        }
        
        return this.repository.asignarPermisosARol(rol, permisos);
    }
}