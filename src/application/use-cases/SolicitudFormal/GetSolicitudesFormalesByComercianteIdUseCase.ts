//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Formales por Comerciante
 *
 * Este módulo implementa la lógica de negocio para obtener todas las solicitudes
 * formales asociadas a un comerciante específico.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes formales de un comerciante específico
 * - Proporcionar acceso a las solicitudes propias del comerciante
 * - Facilitar la gestión de solicitudes por parte del comerciante
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener solicitudes formales de un comerciante específico.
 * 
 * Esta clase implementa la lógica para recuperar todas las solicitudes formales
 * que fueron creadas por un comerciante específico, permitiendo que cada comerciante
 * gestione sus propias solicitudes.
 */
export class GetSolicitudesFormalesByComercianteIdUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes formales por comerciante.
     * 
     * Este método busca y retorna todas las solicitudes formales que fueron
     * creadas por el comerciante especificado.
     * 
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren obtener
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales del comerciante
     */
    async execute(comercianteId: number): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByComercianteId(comercianteId);
    }
}
