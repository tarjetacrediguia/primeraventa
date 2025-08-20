// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByComercianteYEstadoUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitudes Iniciales por Comerciante y Estado
 *
 * Este módulo implementa la lógica de negocio para obtener solicitudes iniciales
 * filtradas por comerciante y estado específico.
 *
 * RESPONSABILIDADES:
 * - Obtener solicitudes iniciales de un comerciante con un estado específico
 * - Proporcionar filtrado combinado para gestión más precisa
 * - Facilitar la búsqueda de solicitudes según comerciante y estado de procesamiento
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para obtener solicitudes iniciales filtradas por comerciante y estado.
 * 
 * Esta clase implementa la lógica para recuperar solicitudes iniciales que pertenecen
 * a un comerciante específico y tienen un estado determinado, permitiendo filtros
 * más precisos para la gestión de solicitudes.
 */
export class GetSolicitudesInicialesByComercianteUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de solicitudes iniciales por comerciante y estado.
     * 
     * Este método busca y retorna todas las solicitudes iniciales que pertenecen
     * al comerciante especificado y tienen el estado indicado.
     * 
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren obtener
     * @param estado - Estado de las solicitudes iniciales a filtrar
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del comerciante y estado especificados
     */
    async execute(comercianteId: number): Promise<SolicitudInicial[]> {
        return this.repository.getSolicitudesInicialesByComerciante(comercianteId);
    }
}
