// src/application/use-cases/Comerciante/GetComercianteByIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Comerciante por ID
 *
 * Este módulo implementa la lógica de negocio para consultar los datos de un comerciante
 * específico a partir de su identificador único.
 *
 * RESPONSABILIDADES:
 * - Consultar un comerciante por su ID
 * - Validar la existencia del comerciante
 */

import { Comerciante } from "../../../domain/entities/Comerciante";
import { ComercianteRepositoryPort } from "../../ports/ComercianteRepositoryPort";

/**
 * Caso de uso para obtener un comerciante por su identificador.
 *
 * Esta clase permite consultar los datos de un comerciante específico,
 * validando su existencia en el sistema.
 */
export class GetComercianteByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de comerciantes
     */
    constructor(private readonly repository: ComercianteRepositoryPort) {}

    /**
     * Ejecuta la consulta de un comerciante por ID.
     *
     * @param id - Identificador único del comerciante
     * @returns Promise<Comerciante> - Comerciante encontrado
     * @throws Error si el comerciante no existe
     */
    async execute(id: number): Promise<Comerciante> {
        const comerciante = await this.repository.getComercianteById(id);
        
        if (!comerciante) {
            throw new Error("Comerciante no encontrado");
        }
        
        return comerciante;
    }
}
