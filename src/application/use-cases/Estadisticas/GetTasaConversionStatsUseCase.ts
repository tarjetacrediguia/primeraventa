//src/application/use-cases/Estadisticas/GetTasaConversionStatsUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Tasa de Conversión
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas sobre la
 * tasa de conversión de solicitudes en el sistema, permitiendo filtrar por rango de fechas.
 *
 * RESPONSABILIDADES:
 * - Consultar la tasa de conversión de solicitudes
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para análisis de efectividad y reportes
 */

import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

/**
 * Caso de uso para obtener estadísticas de tasa de conversión de solicitudes.
 * 
 * Esta clase implementa la lógica para consultar la tasa de conversión de solicitudes,
 * útil para análisis de efectividad y optimización de procesos.
 */
export class GetTasaConversionStatsUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de tasa de conversión de solicitudes.
   * 
   * Este método retorna estadísticas de tasa de conversión, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de tasa de conversión
   */
  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getTasaConversionStats(desde, hasta);
  }
}
