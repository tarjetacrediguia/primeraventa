// src/application/use-cases/Comerciante/GetAllComercianteUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Todos los Comerciantes
 *
 * Este módulo implementa la lógica de negocio para consultar el listado completo
 * de comerciantes registrados en el sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar todos los comerciantes existentes
 * - Permitir la visualización general de comerciantes
 */

import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

/**
 * Caso de uso para obtener el listado de todos los comerciantes.
 *
 * Esta clase permite consultar y retornar todos los comerciantes registrados
 * en el sistema.
 */
export class GetAllComercianteUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    /**
     * Ejecuta la consulta de todos los comerciantes.
     *
     * @returns Promise<Comerciante[]> - Listado de comerciantes registrados
     */
    async execute(): Promise<Comerciante[]> {
        return this.repository.getAllComerciantes();
    }
}
