// src/application/use-cases/Administrador/DeleteAdminUseCase.ts

/**
 * MÓDULO: Caso de Uso - Eliminar Administrador
 *
 * Este módulo implementa la lógica de negocio para eliminar un administrador
 * existente del sistema, validando su existencia antes de proceder.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del administrador
 * - Eliminar el administrador del repositorio
 */

import { AdministradorRepositoryPort } from "../../ports/AdministradorRepositoryPort";

/**
 * Caso de uso para eliminar un administrador existente.
 *
 * Esta clase permite eliminar un administrador del sistema,
 * validando previamente su existencia.
 */
export class DeleteAdminUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de administradores
     */
    constructor(private readonly repository: AdministradorRepositoryPort) {}

    /**
     * Ejecuta la eliminación de un administrador.
     *
     * @param id - Identificador único del administrador a eliminar
     * @returns Promise<void>
     * @throws Error si el administrador no existe
     */
    async execute(id: number): Promise<void> {
        // Verificar existencia antes de eliminar
        const existe = await this.repository.getAdministradorById(id);
        if (!existe) {
            throw new Error("Administrador no encontrado");
        }
        
        return this.repository.deleteAdministrador(id);
    }
}
