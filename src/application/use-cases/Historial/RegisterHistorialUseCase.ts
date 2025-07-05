//src/application/use-cases/Historial/RegisterHistorialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Registrar Evento en Historial
 *
 * Este módulo implementa la lógica de negocio para registrar un nuevo evento
 * en el historial del sistema, permitiendo la trazabilidad de acciones y cambios
 * en las entidades principales.
 *
 * RESPONSABILIDADES:
 * - Registrar eventos relevantes en el historial
 * - Asociar eventos a usuarios, entidades y acciones específicas
 * - Facilitar la auditoría y el seguimiento de operaciones
 */

import { Historial } from "../../../domain/entities/Historial";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

/**
 * Caso de uso para registrar un evento en el historial del sistema.
 * 
 * Esta clase implementa la lógica para crear un nuevo registro de historial,
 * asociando la acción a un usuario, entidad y detalles específicos.
 */
export class RegisterHistorialUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param historialRepository - Puerto para operaciones de historial
     */
    constructor(private readonly historialRepository: HistorialRepositoryPort) {}

    /**
     * Ejecuta el registro de un evento en el historial.
     * 
     * Este método crea un nuevo registro de historial con los datos proporcionados.
     * 
     * @param usuarioId - ID del usuario que realiza la acción (puede ser null para acciones automáticas)
     * @param accion - Acción realizada (por ejemplo: creación, actualización, eliminación)
     * @param entidadAfectada - Nombre de la entidad afectada por la acción
     * @param entidadId - ID de la entidad afectada
     * @param detalles - Objeto con detalles adicionales del evento
     * @returns Promise<Historial> - El evento de historial registrado
     */
    async execute(
        usuarioId: number | null,
        accion: string,
        entidadAfectada: string,
        entidadId: number,
        detalles: any,
    ): Promise<Historial> {
        const historialData = {
            usuarioId,
            accion,
            entidadAfectada,
            entidadId,
            detalles
        } as Omit<Historial, 'id'>;

        return this.historialRepository.registrarEvento(historialData);
    }
}
