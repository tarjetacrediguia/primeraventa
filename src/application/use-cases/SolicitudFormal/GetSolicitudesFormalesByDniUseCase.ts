//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByDniUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Formales por DNI
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes formales
 * filtradas por el DNI del cliente.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes formales de un cliente específico por DNI
 * - Proporcionar búsqueda por identificación del cliente
 * - Facilitar la consulta de historial de solicitudes de un cliente
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener solicitudes formales de un cliente específico por DNI.
 * 
 * Esta clase implementa la lógica para recuperar todas las solicitudes formales
 * asociadas a un cliente específico mediante su DNI, útil para consultar el
 * historial de solicitudes de un cliente.
 */
export class GetSolicitudesFormalesByDniUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes formales por DNI del cliente.
     * 
     * Este método busca y retorna todas las solicitudes formales que están
     * asociadas al cliente con el DNI especificado.
     * 
     * @param dni - DNI del cliente cuyas solicitudes se quieren obtener
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales del cliente
     */
    async execute(dni: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByDni(dni);
    }
}
