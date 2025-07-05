//src/application/use-cases/Estadisticas/GetActividadSistemaUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Actividad del Sistema
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas de actividad
 * general del sistema en un rango de fechas determinado.
 *
 * RESPONSABILIDADES:
 * - Consultar la actividad global del sistema
 * - Permitir filtrado por rango de fechas (opcional)
 * - Proveer datos para dashboards y reportes de uso
 */

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

/**
 * Caso de uso para obtener la actividad general del sistema.
 * 
 * Esta clase implementa la lógica para consultar estadísticas de actividad,
 * permitiendo filtrar por fechas y obtener información relevante para análisis.
 */
export class GetActividadSistemaUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de actividad del sistema.
   * 
   * Este método retorna estadísticas de actividad global, permitiendo filtrar
   * por un rango de fechas si se especifica.
   * 
   * @param desde - Fecha de inicio del rango (opcional)
   * @param hasta - Fecha de fin del rango (opcional)
   * @returns Promise<any> - Estadísticas de actividad del sistema
   */
  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getActividadSistema(desde, hasta);
  }
}
