// src/application/use-cases/SolicitudFormal/ConsultarEstadoDeSolicitudesFormalesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Consultar Estado de Solicitudes Formales
 *
 * Este módulo implementa la lógica de negocio para consultar el estado de todas
 * las solicitudes formales pendientes en el sistema.
 *
 * RESPONSABILIDADES:
 * - Obtener todas las solicitudes formales con estado "pendiente"
 * - Proporcionar una vista general de solicitudes que requieren atención
 * - Facilitar el seguimiento de solicitudes en proceso de revisión
 */

import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

/**
 * Caso de uso para consultar el estado de solicitudes formales pendientes.
 * 
 * Esta clase implementa la lógica para obtener todas las solicitudes formales
 * que están en estado "pendiente", principalmente utilizada por analistas y
 * administradores para gestionar solicitudes que requieren revisión.
 */
export class ConsultarEstadoDeSolicitudesFormalesUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la consulta de solicitudes formales pendientes.
     * 
     * Este método obtiene todas las solicitudes formales que están en estado
     * "pendiente", facilitando el seguimiento de solicitudes que requieren
     * atención por parte de analistas o administradores.
     * 
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales pendientes
     */
    async execute(): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByEstado("pendiente");
    }
}
