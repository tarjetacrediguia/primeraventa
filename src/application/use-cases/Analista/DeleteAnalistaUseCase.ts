// src/application/use-cases/Analista/DeleteAnalistaUseCase.ts

/**
 * MÓDULO: Caso de Uso - Eliminar Analista
 *
 * Este módulo implementa la lógica de negocio para eliminar un analista
 * existente del sistema, validando su existencia antes de proceder.
 *
 * RESPONSABILIDADES:
 * - Verificar la existencia del analista
 * - Eliminar el analista del repositorio
 */

import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

/**
 * Caso de uso para eliminar un analista existente.
 *
 * Esta clase permite eliminar un analista del sistema,
 * validando previamente su existencia.
 */
export class DeleteAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    /**
     * Ejecuta la eliminación de un analista.
     *
     * @param id - Identificador único del analista a eliminar
     * @returns Promise<void>
     * @throws Error si el analista no existe
     */
    async execute(id: number): Promise<void> {
        // Verificar existencia
        const existe = await this.repository.getAnalistaById(id);
        if (!existe) {
            throw new Error("Analista no encontrado");
        }
        
        return this.repository.deleteAnalista(id);
    }
}
