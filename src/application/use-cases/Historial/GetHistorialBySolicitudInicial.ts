//src/application/use-cases/Historial/GetHistorialBySolicitudInicial.ts

/**
 * MÓDULO: Caso de Uso - Obtener Historial por Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para obtener el historial completo
 * de eventos relacionados a una solicitud inicial, incluyendo creación, aprobación,
 * generación de solicitud formal, modificaciones, aprobación/rechazo y generación/descarga de contrato.
 *
 * RESPONSABILIDADES:
 * - Obtener todos los eventos históricos asociados a una solicitud inicial
 * - Proporcionar trazabilidad completa del ciclo de vida de la solicitud
 * - Facilitar auditoría y seguimiento de cada paso del proceso
 */

//en base al id de una solicitud inicial, obtener el historial de esa solicitud y todos los eventos relacionados
//se tiene que saber la creacion de las solicitudes iniciales
//el momento/datos de la aprobacion de la solicitud inicial
//el momento/datos de la creacion de la solicitud formal
//el momento/datos de alguna modificacion de la solicitud formal
//el momento/datos de la aprobacion/rechazo de la solicitud formal
//el momento/datos de generacion del contrato
//el momento/datos de la descarga del contrato

//todos estos eventos deben formar parte del historial de la solicitud inicial el cual se entrega en este caso de uso

import { Historial } from "../../../domain/entities/Historial";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

/**
 * Caso de uso para obtener el historial completo de una solicitud inicial.
 * 
 * Esta clase implementa la lógica para recuperar todos los eventos históricos
 * asociados a una solicitud inicial, permitiendo la trazabilidad y auditoría
 * del ciclo de vida de la solicitud y sus entidades relacionadas.
 */
export class GetHistorialBySolicitudInicialUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param historialRepository - Puerto para operaciones de historial
     */
    constructor(private readonly historialRepository: HistorialRepositoryPort) {}

    /**
     * Ejecuta la obtención del historial por solicitud inicial.
     * 
     * Este método retorna todos los eventos históricos asociados a la solicitud inicial especificada.
     * 
     * @param solicitudInicialId - ID de la solicitud inicial cuyo historial se quiere obtener
     * @returns Promise<Historial[]> - Array con los eventos históricos de la solicitud
     */
    async execute(solicitudInicialId: number): Promise<Historial[]> {
        return this.historialRepository.obtenerPorSolicitudInicial(solicitudInicialId);
    }
}
