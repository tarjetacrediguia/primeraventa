//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByEstadoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Formales por Estado
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes formales
 * filtradas por su estado actual (pendiente, aprobada, rechazada).
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes formales con un estado específico
 * - Proporcionar filtrado por estado para análisis y gestión
 * - Facilitar la búsqueda de solicitudes según su estado de procesamiento
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener solicitudes formales filtradas por estado.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes formales que tienen
 * un estado específico, útil para análisis de flujo de trabajo y gestión de solicitudes.
 */
export class GetSolicitudesFormalesByEstadoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes formales por estado.
     * 
     * Este método busca y retorna todas las solicitudes formales que tienen
     * el estado especificado (pendiente, aprobada, rechazada).
     * 
     * @param estado - Estado de las solicitudes formales a filtrar
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales del estado especificado
     */
    async execute(estado: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByEstado(estado);
    }
}
