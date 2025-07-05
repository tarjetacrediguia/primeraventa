// src/application/use-cases/Permisos/AsignarPermisosRolUseCase.ts

/**
 * MÓDULO: Caso de Uso - Asignar Permisos a Rol
 *
 * Este módulo implementa la lógica de negocio para asignar uno o varios permisos
 * a un rol específico del sistema, validando que los permisos existan y que el rol sea válido.
 *
 * RESPONSABILIDADES:
 * - Validar el rol y los permisos a asignar
 * - Verificar que los permisos existan en el sistema
 * - Asignar los permisos al rol correspondiente
 * - Manejar errores y notificar permisos o roles inválidos
 */

import { PermisoRepositoryPort } from "../../ports/PermisoRepositoryPort";
import { Permiso } from "../../../domain/entities/Permiso";

/**
 * Caso de uso para asignar permisos a un rol del sistema.
 * 
 * Esta clase implementa la lógica para validar y asignar uno o varios permisos
 * a un rol específico, asegurando que tanto el rol como los permisos existan en el sistema.
 */
export class AsignarPermisosRolUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de permisos
     */
    constructor(private readonly repository: PermisoRepositoryPort) {}

    /**
     * Ejecuta la asignación de permisos a un rol.
     * 
     * Este método valida que el rol y los permisos existan, verifica que los
     * permisos a asignar sean válidos y realiza la asignación.
     * 
     * @param rol - Nombre del rol al que se le asignarán los permisos
     * @param permisos - Array de nombres de permisos a asignar
     * @returns Promise<void> - No retorna valor
     * @throws Error - Si el rol o los permisos son inválidos
     */
    async execute(rol: string, permisos: string[]): Promise<void> {
        const rolesValidos = ['administrador', 'analista', 'comerciante'];
        if (!rolesValidos.includes(rol)) {
            throw new Error(`Rol inválido: ${rol}`);
        }
        
        const permisosValidos: Permiso[] = await this.repository.getAllPermisos();
        // Extraer solo los nombres de los permisos válidos
        const nombresPermisosValidos = permisosValidos.map(p => p.nombre);
        const permisosInvalidos = permisos.filter(
            p => !nombresPermisosValidos.includes(p)
        );
        if (permisosInvalidos.length > 0) {
            throw new Error(`Permisos inválidos: ${permisosInvalidos.join(', ')}`);
        }
        
        return this.repository.asignarPermisosARol(rol, permisos);
    }
}
