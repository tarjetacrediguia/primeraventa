// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByFechaUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Iniciales por Fecha
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes iniciales
 * filtradas por una fecha específica de creación.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes iniciales creadas en una fecha específica
 * - Proporcionar filtrado temporal para análisis y reportes
 * - Facilitar la búsqueda de solicitudes por período de tiempo
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para obtener solicitudes iniciales filtradas por fecha de creación.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes iniciales que fueron
 * creadas en una fecha específica, útil para reportes y análisis temporales.
 */
export class GetSolicitudesInicialesByFechaUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes iniciales por fecha de creación.
     * 
     * Este método busca y retorna todas las solicitudes iniciales que fueron
     * creadas en la fecha especificada.
     * 
     * @param fecha - Fecha de creación para filtrar las solicitudes iniciales
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales de la fecha especificada
     */
    async execute(fecha: Date): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByFecha(fecha);
    }
}
