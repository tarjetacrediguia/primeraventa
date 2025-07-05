// src/application/use-cases/Comerciante/DeleteComercianteUseCase.ts

/**
 * MÓDULO: Caso de Uso - Eliminar Comerciante
 *
 * Este módulo implementa la lógica de negocio para eliminar un comerciante
 * existente del sistema, validando su existencia antes de proceder.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del comerciante
 * - Eliminar el comerciante del repositorio
 */

import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

/**
 * Caso de uso para eliminar un comerciante existente.
 *
 * Esta clase permite eliminar un comerciante del sistema,
 * validando previamente su existencia.
 */
export class DeleteComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    /**
     * Ejecuta la eliminación de un comerciante.
     *
     * @param id - Identificador único del comerciante a eliminar
     * @returns Promise<void>
     * @throws Error si el comerciante no existe
     */
    async execute(id: number): Promise<void> {
        // Verificar existencia
        const existe = await this.repository.getComercianteById(id);
        if (!existe) {
            throw new Error("Comerciante no encontrado");
        }
        
        return this.repository.deleteComerciante(id);
    }
}
