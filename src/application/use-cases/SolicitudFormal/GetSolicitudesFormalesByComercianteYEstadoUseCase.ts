// src/application/use-cases/SolicitudFormal/GetSolicitudesFormalesByComercianteYEstadoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Formales por Comerciante y Estado
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes formales
 * filtradas por comerciante y estado específico.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes formales de un comerciante con un estado específico
 * - Proporcionar filtrado combinado para gestión más precisa
 * - Facilitar la búsqueda de solicitudes según comerciante y estado de procesamiento
 */

import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";

/**
 * Caso de uso para obtener solicitudes formales filtradas por comerciante y estado.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes formales que pertenecen
 * a un comerciante específico y tienen un estado determinado, permitiendo filtros
 * más precisos para la gestión de solicitudes.
 */
export class GetSolicitudesFormalesByComercianteYEstadoUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     */
    constructor(private readonly repository: SolicitudFormalRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes formales por comerciante y estado.
     * 
     * Este método busca y retorna todas las solicitudes formales que pertenecen
     * al comerciante especificado y tienen el estado indicado.
     * 
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren obtener
     * @param estado - Estado de las solicitudes formales a filtrar
     * @returns Promise<SolicitudFormal[]> - Array con las solicitudes formales del comerciante y estado especificados
     */
    async execute(comercianteId: number, estado: string): Promise<SolicitudFormal[]> {
        return this.repository.getSolicitudesFormalesByComercianteYEstado(comercianteId, estado);
    }
}
