// src/application/ports/EstadisticasRepositoryPort.ts
export interface EstadisticasRepositoryPort {
  getSolicitudesInicialesStats(desde?: Date, hasta?: Date): Promise<any>;
  getSolicitudesFormalesStats(desde?: Date, hasta?: Date): Promise<any>;
  getTiemposAprobacionStats(desde?: Date, hasta?: Date): Promise<any>;
  getTasaConversionStats(desde?: Date, hasta?: Date): Promise<any>;
  getContratosStats(desde?: Date, hasta?: Date): Promise<any>;
  getEstadisticasComerciantes(desde?: string, hasta?: string): Promise<any>;
  getEstadisticasAnalistas(desde?: string, hasta?: string): Promise<any>;
  getActividadSistema(desde?: string, hasta?: string): Promise<any>;
  getTiemposResolucion(desde?: string, hasta?: string): Promise<any>;
}