// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Iniciales por Comerciante
 *
 * Este módulo implementa la lógica de negocio para obtener todas las solicitudes
 * iniciales asociadas a un comerciante específico.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes iniciales de un comerciante específico
 * - Proporcionar acceso a las solicitudes propias del comerciante
 * - Facilitar la gestión de solicitudes por parte del comerciante
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para obtener solicitudes iniciales de un comerciante específico.
 * 
 * Esta clase implementa la lógica para recuperar todas las solicitudes iniciales
 * que fueron creadas por un comerciante específico, permitiendo que cada comerciante
 * gestione sus propias solicitudes.
 */
export class GetSolicitudesInicialesByComercianteIdUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes iniciales por comerciante.
     * 
     * Este método busca y retorna todas las solicitudes iniciales que fueron
     * creadas por el comerciante especificado.
     * 
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren obtener
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del comerciante
     */
    async execute(comercianteId: number): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
    }
}
