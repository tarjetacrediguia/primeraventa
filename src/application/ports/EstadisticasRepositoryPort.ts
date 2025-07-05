// src/application/ports/EstadisticasRepositoryPort.ts

/**
 * MÓDULO: Puerto de Repositorio de Estadísticas
 *
 * Este módulo define la interfaz para el puerto de repositorio de estadísticas que permite
 * obtener métricas y análisis del rendimiento del sistema.
 *
 * RESPONSABILIDADES:
 * - Proporcionar estadísticas de solicitudes iniciales y formales
 * - Calcular métricas de tiempos de aprobación y resolución
 * - Generar estadísticas de comerciantes y analistas
 * - Analizar la actividad general del sistema
 */

/**
 * Puerto para operaciones de repositorio de estadísticas.
 *
 * Esta interfaz define los métodos necesarios para obtener
 * métricas y análisis del rendimiento del sistema.
 */
export interface EstadisticasRepositoryPort {
    /**
     * Obtiene estadísticas de solicitudes iniciales en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de solicitudes iniciales
     */
    getSolicitudesInicialesStats(desde?: Date, hasta?: Date): Promise<any>;

    /**
     * Obtiene estadísticas de solicitudes formales en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de solicitudes formales
     */
    getSolicitudesFormalesStats(desde?: Date, hasta?: Date): Promise<any>;

    /**
     * Obtiene estadísticas de tiempos de aprobación en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de tiempos de aprobación
     */
    getTiemposAprobacionStats(desde?: Date, hasta?: Date): Promise<any>;

    /**
     * Obtiene estadísticas de tasa de conversión en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de tasa de conversión
     */
    getTasaConversionStats(desde?: Date, hasta?: Date): Promise<any>;

    /**
     * Obtiene estadísticas de contratos en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de contratos
     */
    getContratosStats(desde?: Date, hasta?: Date): Promise<any>;

    /**
     * Obtiene estadísticas de comerciantes en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de comerciantes
     */
    getEstadisticasComerciantes(desde?: string, hasta?: string): Promise<any>;

    /**
     * Obtiene estadísticas de analistas en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de analistas
     */
    getEstadisticasAnalistas(desde?: string, hasta?: string): Promise<any>;

    /**
     * Obtiene estadísticas de actividad general del sistema en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de actividad del sistema
     */
    getActividadSistema(desde?: string, hasta?: string): Promise<any>;

    /**
     * Obtiene estadísticas de tiempos de resolución en un período específico.
     *
     * @param desde - Fecha de inicio del período (opcional)
     * @param hasta - Fecha de fin del período (opcional)
     * @returns Promise<any> - Estadísticas de tiempos de resolución
     */
    getTiemposResolucion(desde?: string, hasta?: string): Promise<any>;
}
