//src/application/use-cases/Estadisticas/GetEstadisticasComerciantesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Comerciantes
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas de desempeño
 * y actividad de los comerciantes del sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar estadísticas de desempeño de comerciantes
 * - Proveer datos para análisis de eficiencia y reportes
 */

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

/**
 * Caso de uso para obtener estadísticas de comerciantes.
 * 
 * Esta clase implementa la lógica para consultar estadísticas de desempeño y actividad
 * de los comerciantes, útil para análisis de recursos humanos y reportes de gestión.
 */
export class GetEstadisticasComerciantesUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de estadísticas de comerciantes.
   * 
   * Este método retorna estadísticas de desempeño y actividad de los comerciantes.
   * 
   * @param desde - Fecha de inicio del rango (opcional, formato string)
   * @param hasta - Fecha de fin del rango (opcional, formato string)
   * @returns Promise<any> - Estadísticas de comerciantes
   */
  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasComerciantes(desde, hasta);
  }
}
