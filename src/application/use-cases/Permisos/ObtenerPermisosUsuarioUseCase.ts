// src/application/use-cases/Permisos/ObtenerPermisosUsuarioUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Permisos de Usuario
 *
 * Este módulo implementa la lógica de negocio para obtener todos los permisos
 * asignados a un usuario específico.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia del usuario
 * - Obtener todos los permisos asignados al usuario
 * - Manejar errores si el usuario no es válido
 */

import { Permiso } from "../../../domain/entities/Permiso";
import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

/**
 * Caso de uso para obtener los permisos de un usuario específico.
 * 
 * Esta clase implementa la lógica para recuperar todos los permisos asignados
 * a un usuario, permitiendo conocer sus privilegios en el sistema.
 */
export class ObtenerPermisosUsuarioUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la obtención de permisos de un usuario.
     * 
     * Este método valida la existencia del usuario y retorna todos los permisos
     * que tiene asignados.
     * 
     * @param usuarioId - ID del usuario cuyos permisos se quieren obtener
     * @returns Promise<Permiso[]> - Array con los permisos asignados al usuario
     * @throws Error - Si el usuario no es válido
     */
    async execute(usuarioId: number): Promise<Permiso[]> {
        if (!usuarioId) {
            throw new Error("Usuario es obligatorio");
        }
        
        return this.repository.getPermisosUsuario(usuarioId);
    }
}
