// src/application/use-cases/Permisos/AsignarPermisoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Asignar Permisos a Usuario
 *
 * Este módulo implementa la lógica de negocio para asignar uno o varios permisos
 * a un usuario específico, validando que los permisos existan en el sistema.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia de usuario y permisos
 * - Verificar que los permisos a asignar sean válidos
 * - Asignar los permisos al usuario
 * - Manejar errores y notificar permisos inválidos
 */

import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { Usuario } from "../../../domain/entities/Usuario";
import { Permiso } from "../../../domain/entities/Permiso";

/**
 * Caso de uso para asignar permisos a un usuario.
 * 
 * Esta clase implementa la lógica para validar y asignar uno o varios permisos
 * a un usuario, asegurando que los permisos existan en el sistema.
 */
export class AsignarPermisoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la asignación de permisos a un usuario.
     * 
     * Este método valida que el usuario y los permisos existan, verifica que los
     * permisos a asignar sean válidos y realiza la asignación.
     * 
     * @param usuarioId - ID del usuario al que se le asignarán los permisos
     * @param permisos - Array de nombres de permisos a asignar
     * @returns Promise<Usuario> - El usuario con los permisos asignados
     * @throws Error - Si faltan datos o hay permisos inválidos
     */
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
