//src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitud Formal por ID
 *
 * Este módulo implementa la lógica de negocio para obtener una solicitud formal
 * específica mediante su identificador único.
 *
 * RESPONSABILIDADES:
 * - Obtener una solicitud formal específica por su ID
 * - Manejar el caso cuando la solicitud no existe
 * - Proporcionar acceso a detalles específicos de una solicitud formal
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

/**
 * Caso de uso para obtener una solicitud formal específica por su ID.
 * 
 * Esta clase implementa la lógica para recuperar una solicitud formal específica
 * del sistema, permitiendo acceder a todos sus detalles y estado actual.
 */
export class GetSolicitudesFormalesByIdUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de una solicitud formal por su ID.
     * 
     * Este método busca y retorna una solicitud formal específica basándose
     * en su identificador único.
     * 
     * @param id - ID único de la solicitud formal a obtener
     * @returns Promise<SolicitudFormal | null> - La solicitud formal encontrada o null si no existe
     */
    async execute(id: number): Promise<SolicitudFormal | null> {
        return this.repository.getSolicitudFormalById(id);
    }
}
