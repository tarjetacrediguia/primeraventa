//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByFechaUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Formales por Fecha
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes formales
 * filtradas por una fecha específica de creación.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes formales creadas en una fecha específica
 * - Proporcionar filtrado temporal para análisis y reportes
 * - Facilitar la búsqueda de solicitudes por período de tiempo
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener solicitudes formales filtradas por fecha de creación.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes formales que fueron
 * creadas en una fecha específica, útil para reportes y análisis temporales.
 */
export class GetSolicitudesFormalesByFechaUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes formales por fecha de creación.
     * 
     * Este método busca y retorna todas las solicitudes formales que fueron
     * creadas en la fecha especificada.
     * 
     * @param fecha - Fecha de creación para filtrar las solicitudes formales
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales de la fecha especificada
     */
    async execute(fecha: Date): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByFecha(fecha);
    }
}
