// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByEstadoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Iniciales por Estado
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes iniciales
 * filtradas por su estado actual (pendiente, aprobada, rechazada).
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes iniciales con un estado específico
 * - Proporcionar filtrado por estado para análisis y gestión
 * - Facilitar la búsqueda de solicitudes según su estado de procesamiento
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para obtener solicitudes iniciales filtradas por estado.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes iniciales que tienen
 * un estado específico, útil para análisis de flujo de trabajo y gestión de solicitudes.
 */
export class GetSolicitudesInicialesByEstadoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes iniciales por estado.
     * 
     * Este método busca y retorna todas las solicitudes iniciales que tienen
     * el estado especificado (pendiente, aprobada, rechazada).
     * 
     * @param estado - Estado de las solicitudes iniciales a filtrar
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del estado especificado
     */
    async execute(estado: string): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByEstado(estado);
    }
}
