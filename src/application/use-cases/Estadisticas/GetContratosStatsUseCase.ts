//src/application/use-cases/Estadisticas/GetContratosStatsUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Contratos
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas sobre los
 * contratos generados en el sistema, permitiendo filtrar por rango de fechas.
 *
 * RESPONSABILIDADES:
 * - Consultar estadísticas de contratos generados
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para análisis y reportes
 */

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

/**
 * Caso de uso para obtener estadísticas de contratos generados.
 * 
 * Esta clase implementa la lógica para consultar estadísticas de contratos,
 * útil para análisis de volumen, tendencias y reportes.
 */
export class GetContratosStatsUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de estadísticas de contratos generados.
   * 
   * Este método retorna estadísticas de contratos, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de contratos generados
   */
  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getContratosStats(desde, hasta);
  }
}
