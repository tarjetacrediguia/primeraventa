// src/application/use-cases/Configuraciones/GetConfUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Configuraciones
 *
 * Este módulo implementa la lógica de negocio para consultar las configuraciones
 * globales del sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar todas las configuraciones registradas
 * - Permitir la visualización de parámetros y valores globales
 */

import { ConfiguracionRepositoryPort } from "../../ports/ConfiguracionRepositoryPort";
import { Configuracion } from "../../../domain/entities/Configuracion";

/**
 * Caso de uso para obtener las configuraciones del sistema.
 *
 * Esta clase permite consultar todas las configuraciones globales
 * almacenadas en el sistema.
 */
export class GetConfUseCase {
    /**
     * Constructor del caso de uso.
     *
     * @param repository - Puerto para operaciones de configuración
     */
    constructor(private readonly repository: ConfiguracionRepositoryPort) {}

    /**
     * Ejecuta la consulta de todas las configuraciones.
     *
     * @returns Promise<Configuracion[]> - Listado de configuraciones registradas
     */
    async execute(): Promise<Configuracion[]> {
        return this.repository.obtenerConfiguracion();
    }
}
