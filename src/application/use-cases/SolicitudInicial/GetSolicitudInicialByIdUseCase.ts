// src/application/use-cases/SolicitudInicial/GetSolicitudesInicialesByIdUseCase.ts

/**
 * MÓDULO: Caso de Uso - Obtener Solicitud Inicial por ID
 *
 * Este módulo implementa la lógica de negocio para obtener una solicitud inicial
 * específica mediante su identificador único.
 *
 * RESPONSABILIDADES:
 * - Obtener una solicitud inicial específica por su ID
 * - Manejar el caso cuando la solicitud no existe
 * - Proporcionar acceso a detalles específicos de una solicitud
 */

import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para obtener una solicitud inicial específica por su ID.
 * 
 * Esta clase implementa la lógica para recuperar una solicitud inicial específica
 * del sistema, permitiendo acceder a todos sus detalles y estado actual.
 */
export class GetSolicitudesInicialesByIdUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     */
    constructor(private readonly repository: SolicitudInicialRepositoryPort) {}

    /**
     * Ejecuta la obtención de una solicitud inicial por su ID.
     * 
     * Este método busca y retorna una solicitud inicial específica basándose
     * en su identificador único.
     * 
     * @param id - ID único de la solicitud inicial a obtener
     * @returns Promise<SolicitudInicial | null> - La solicitud inicial encontrada o null si no existe
     */
    async execute(id: number): Promise<SolicitudInicial | null> {
        return this.repository.getSolicitudInicialById(id);
    }
}
