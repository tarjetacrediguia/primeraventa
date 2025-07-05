//src/application/use-cases/Estadisticas/GetTiemposResolucionUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Tiempos de Resolución
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas sobre los
 * tiempos de resolución de solicitudes o procesos en el sistema, permitiendo filtrar
 * por rango de fechas.
 *
 * RESPONSABILIDADES:
 * - Consultar los tiempos de resolución de procesos
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para análisis de eficiencia y reportes
 */

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

/**
 * Caso de uso para obtener estadísticas de tiempos de resolución.
 * 
 * Esta clase implementa la lógica para consultar los tiempos promedio, mínimos y máximos
 * de resolución de procesos, útil para análisis de eficiencia operativa.
 */
export class GetTiemposResolucionUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de tiempos de resolución.
   * 
   * Este método retorna estadísticas de tiempos de resolución, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de tiempos de resolución
   */
  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getTiemposResolucion(desde, hasta);
  }
}
