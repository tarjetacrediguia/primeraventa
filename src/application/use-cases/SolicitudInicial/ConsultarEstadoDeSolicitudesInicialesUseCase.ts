// src/application/use-cases/SolicitudInicial/ConsultarEstadoDeSolicitudesInicialesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Consultar Estado de Solicitudes Iniciales
 *
 * Este módulo implementa la lógica de negocio para consultar el estado de todas
 * las solicitudes iniciales asociadas a un comerciante específico.
 *
 * RESPONSABILIDADES:
 * - Obtener todas las solicitudes iniciales de un comerciante
 * - Manejar el caso cuando no hay solicitudes disponibles
 * - Notificar al comerciante sobre el resultado de la consulta
 * - Manejar errores en la consulta y notificar al usuario
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { NotificationPort } from "../../ports/NotificationPort";

/**
 * Caso de uso para consultar el estado de solicitudes iniciales de un comerciante.
 * 
 * Esta clase implementa la lógica para que un comerciante pueda consultar
 * todas sus solicitudes iniciales y recibir notificaciones sobre el resultado
 * de la consulta.
 */
export class ConsultarEstadoDeSolicitudesInicialesUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param notificationService - Puerto para servicios de notificación
     */
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly notificationService: NotificationPort
    ) {}

    /**
     * Ejecuta la consulta de solicitudes iniciales de un comerciante.
     * 
     * Este método obtiene todas las solicitudes iniciales asociadas al comerciante
     * y maneja los casos especiales como la ausencia de solicitudes o errores
     * en la consulta, enviando notificaciones apropiadas en cada caso.
     * 
     * @param comercianteId - ID del comerciante cuyas solicitudes se quieren consultar
     * @returns Promise<SolicitudInicial[]> - Array con las solicitudes iniciales del comerciante
     * @throws Error - Si ocurre un error durante la consulta de solicitudes
     */
    async execute(comercianteId: number): Promise<SolicitudInicial[]> {
        try {
            // Obtener solicitudes del comerciante
            const solicitudes = await this.repository.getSolicitudesInicialesByComercianteId(comercianteId);
            
            if (solicitudes.length === 0) {
                // Notificar al comerciante que no hay solicitudes
                await this.notificationService.emitNotification({
                    userId: Number(comercianteId),
                    type: "solicitud_inicial",
                    message: "No se encontraron solicitudes iniciales para su comercio"
                });
                return [];
            }
            
            return solicitudes;
        } catch (error) {
            // Notificar error al comerciante
            await this.notificationService.emitNotification({
                userId: Number(comercianteId),
                type: "error",
                message: "Error al consultar solicitudes iniciales"
            });
            if (error instanceof Error) {
                throw new Error("Error al consultar solicitudes: " + error.message);
            } else {
                throw new Error("Error al consultar solicitudes: " + String(error));
            }
        }
    }
}
