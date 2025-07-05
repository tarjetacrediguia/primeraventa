// src/application/use-cases/Permisos/VerificarPermisoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Verificar Permiso de Usuario
 *
 * Este módulo implementa la lógica de negocio para verificar si un usuario
 * posee un permiso específico dentro del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia del usuario y el permiso
 * - Consultar si el usuario tiene el permiso solicitado
 * - Manejar errores si faltan datos
 */

import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";

/**
 * Caso de uso para verificar si un usuario tiene un permiso específico.
 * 
 * Esta clase implementa la lógica para consultar si un usuario posee un permiso
 * determinado, útil para validaciones de acceso y control de privilegios.
 */
export class VerificarPermisoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la verificación de permiso para un usuario.
     * 
     * Este método valida la existencia de los datos y consulta si el usuario
     * tiene el permiso solicitado.
     * 
     * @param usuarioId - ID del usuario a verificar
     * @param permiso - Nombre del permiso a verificar
     * @returns Promise<boolean> - true si el usuario tiene el permiso, false en caso contrario
     * @throws Error - Si faltan datos obligatorios
     */
    async execute(usuarioId: number, permiso: string): Promise<boolean> {
        if (!usuarioId || !permiso) {
            throw new Error("Usuario y permiso son obligatorios");
        }
        
        return this.repository.usuarioTienePermiso(usuarioId, permiso);
    }
}
