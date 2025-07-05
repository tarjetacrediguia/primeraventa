//src/application/use-cases/Estadisticas/GetTiemposAprobacionStatsUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Tiempos de Aprobación
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas sobre los
 * tiempos de aprobación de solicitudes en el sistema, permitiendo filtrar por rango de fechas.
 *
 * RESPONSABILIDADES:
 * - Consultar los tiempos de aprobación de solicitudes
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para análisis de eficiencia y reportes
 */

import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

/**
 * Caso de uso para obtener estadísticas de tiempos de aprobación de solicitudes.
 * 
 * Esta clase implementa la lógica para consultar los tiempos promedio, mínimos y máximos
 * de aprobación de solicitudes, útil para análisis de eficiencia operativa.
 */
export class GetTiemposAprobacionStatsUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de tiempos de aprobación de solicitudes.
   * 
   * Este método retorna estadísticas de tiempos de aprobación, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de tiempos de aprobación
   */
  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getTiemposAprobacionStats(desde, hasta);
  }
}
