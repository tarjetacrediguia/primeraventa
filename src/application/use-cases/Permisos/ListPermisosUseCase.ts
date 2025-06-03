// src/application/use-cases/Permisos/ListPermisosUseCase.ts
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

export class ListPermisosUseCase {
    constructor(private readonly repository: PermisoRepositoryPort) {}

    async execute(
        categoria?: string,
        incluirDetalles: boolean = false
    ): Promise<string[] | Array<{nombre: string; descripcion: string; categoria: string}>> {
        const permisos = await this.repository.getAllPermisos();
        
        if (!incluirDetalles) {
            return categoria 
                ? permisos.filter(p => p.startsWith(`${categoria}.`)) 
                : permisos;
        }
        
        // Obtener detalles para cada permiso
        const permisosConDetalles = [];
        for (const permiso of permisos) {
            // Si se especificó categoría, filtrar por ella
            if (categoria && !permiso.startsWith(`${categoria}.`)) continue;
            
            const detalle = await this.repository.getPermisoDetalle(permiso);
            if (detalle) {
                permisosConDetalles.push({
                    nombre: permiso,
                    descripcion: detalle.descripcion,
                    categoria: detalle.categoria
                });
            }
        }
        
        return permisosConDetalles;
    }
}