//src/application/use-cases/SolicitudFormal/GetAllSolicitudesFormalesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Todas las Solicitudes Formales
 *
 * Este módulo implementa la lógica de negocio para obtener todas las solicitudes
 * formales del sistema sin filtros específicos.
 *
 * RESPONSABILIDADES:
 * - Obtener todas las solicitudes formales del sistema
 * - Proporcionar acceso a la lista completa para administradores y analistas
 * - Facilitar la gestión global de solicitudes formales
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener todas las solicitudes formales del sistema.
 * 
 * Esta clase implementa la lógica para obtener la lista completa de solicitudes
 * formales, principalmente utilizada por administradores y analistas para
 * tener una visión general de todas las solicitudes formales en el sistema.
 */
export class GetAllSolicitudesFormalesUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de todas las solicitudes formales.
     * 
     * Este método retorna todas las solicitudes formales almacenadas en el sistema
     * sin aplicar filtros específicos.
     * 
     * @returns Promise<SolicitudFormal[]> - Array con todas las solicitudes formales del sistema
     */
    async execute(): Promise<SolicitudFormal[]> {
        return this.repository.getAllSolicitudesFormales();
    }
}
