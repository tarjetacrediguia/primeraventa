//src/application/use-cases/Estadisticas/GetSolicitudesFormalesStatsUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Solicitudes Formales
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas sobre las
 * solicitudes formales en el sistema, permitiendo filtrar por rango de fechas.
 *
 * RESPONSABILIDADES:
 * - Consultar estadísticas de solicitudes formales
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para análisis y reportes
 */

import { EstadisticasRepositoryPort } from '../../ports/EstadisticasRepositoryPort';

/**
 * Caso de uso para obtener estadísticas de solicitudes formales.
 * 
 * Esta clase implementa la lógica para consultar estadísticas de solicitudes formales,
 * útil para análisis de volumen, tendencias y reportes.
 */
export class GetSolicitudesFormalesStatsUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de estadísticas de solicitudes formales.
   * 
   * Este método retorna estadísticas de solicitudes formales, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de solicitudes formales
   */
  async execute(desde?: Date, hasta?: Date): Promise<any> {
    return this.repository.getSolicitudesFormalesStats(desde, hasta);
  }
}
