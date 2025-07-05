// src/application/use-cases/Analista/GetAllAnalistaUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Todos los Analistas
 *
 * Este módulo implementa la lógica de negocio para consultar el listado completo
 * de analistas registrados en el sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar todos los analistas existentes
 * - Permitir la visualización general de analistas
 */

import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

/**
 * Caso de uso para obtener el listado de todos los analistas.
 *
 * Esta clase permite consultar y retornar todos los analistas registrados
 * en el sistema.
 */
export class GetAllAnalistaUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    /**
     * Ejecuta la consulta de todos los analistas.
     *
     * @returns Promise<Analista[]> - Listado de analistas registrados
     */
    async execute(): Promise<Analista[]> {
        return this.repository.getAllAnalistas();
    }
}
