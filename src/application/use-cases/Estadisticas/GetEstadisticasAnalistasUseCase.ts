//src/application/use-cases/Estadisticas/GetEstadisticasAnalistasUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Estadísticas de Analistas
 *
 * Este módulo implementa la lógica de negocio para obtener estadísticas de desempeño
 * y actividad de los analistas del sistema.
 *
 * RESPONSABILIDADES:
 * - Consultar estadísticas de desempeño de analistas
 * - Proveer datos para análisis de eficiencia y reportes
 */

import { EstadisticasRepositoryPort } from "../../ports/EstadisticasRepositoryPort";

/**
 * Caso de uso para obtener estadísticas de analistas.
 * 
 * Esta clase implementa la lógica para consultar estadísticas de desempeño y actividad
 * de los analistas, útil para análisis de recursos humanos y reportes de gestión.
 */
export class GetEstadisticasAnalistasUseCase {
  /**
   * Constructor del caso de uso.
   * 
   * @param repository - Puerto para operaciones de estadísticas
   */
  constructor(private readonly repository: EstadisticasRepositoryPort) {}

  /**
   * Ejecuta la consulta de estadísticas de analistas.
   * 
   * Este método retorna estadísticas de desempeño y actividad de los analistas.
   * 
   * @param desde - Fecha de inicio del rango (opcional, formato string)
   * @param hasta - Fecha de fin del rango (opcional, formato string)
   * @returns Promise<any> - Estadísticas de analistas
   */
  async execute(desde?: string, hasta?: string): Promise<any> {
    return this.repository.getEstadisticasAnalistas(desde, hasta);
  }
}
