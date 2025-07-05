// src/application/use-cases/Analista/GetAnalistaByIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Analista por ID
 *
 * Este módulo implementa la lógica de negocio para consultar los datos de un analista
 * específico a partir de su identificador único.
 *
 * RESPONSABILIDADES:
 * - Consultar un analista por su ID
 * - Validar la existencia del analista
 */

import { Analista } from "../../../domain/entities/Analista";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";

/**
 * Caso de uso para obtener un analista por su identificador.
 *
 * Esta clase permite consultar los datos de un analista específico,
 * validando su existencia en el sistema.
 */
export class GetAnalistaByIdUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto de acceso al repositorio de analistas
     */
    constructor(private readonly repository: AnalistaRepositoryPort) {}

    /**
     * Ejecuta la consulta de un analista por ID.
     *
     * @param id - Identificador único del analista
     * @returns Promise<Analista> - Analista encontrado
     * @throws Error si el analista no existe
     */
    async execute(id: number): Promise<Analista> {
        const analista = await this.repository.getAnalistaById(id);
        
        if (!analista) {
            throw new Error("Analista no encontrado");
        }
        
        return analista;
    }
}
