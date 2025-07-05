// src/application/use-cases/SolicitudInicial/VerificarAprobacionSolicitudInicialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Verificar Aprobación de Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para verificar automáticamente
 * la aprobación de solicitudes iniciales mediante consulta al servicio Veraz.
 *
 * RESPONSABILIDADES:
 * - Verificar el estado actual de la solicitud inicial
 * - Consultar el servicio Veraz para obtener el score del cliente
 * - Actualizar el estado de la solicitud según la respuesta de Veraz
 * - Notificar al comerciante sobre el resultado de la verificación
 * - Manejar errores en la consulta a servicios externos
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { VerazPort } from "../../ports/VerazPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";

/**
 * Caso de uso para verificar automáticamente la aprobación de solicitudes iniciales.
 * 
 * Esta clase implementa la lógica para consultar el servicio Veraz y determinar
 * automáticamente si una solicitud inicial debe ser aprobada o rechazada
 * basándose en el score crediticio del cliente.
 */
export class VerificarAprobacionSolicitudInicialUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param verazService - Puerto para servicios de Veraz
     * @param notificationService - Puerto para servicios de notificación
     */
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly verazService: VerazPort,
        private readonly notificationService: NotificationPort
    ) {}

    /**
     * Ejecuta la verificación automática de aprobación de una solicitud inicial.
     * 
     * Este método implementa el flujo completo de verificación:
     * 1. Obtiene la solicitud inicial por ID
     * 2. Verifica que esté en estado pendiente
     * 3. Consulta el servicio Veraz con el DNI del cliente
     * 4. Actualiza el estado según la respuesta (aprobada/rechazada)
     * 5. Notifica al comerciante sobre el resultado
     * 
     * @param solicitudId - ID de la solicitud inicial a verificar
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe o ocurre un error en la consulta a Veraz
     */
    async execute(solicitudId: number): Promise<SolicitudInicial> {
        // 1. Obtener solicitud
        const solicitud = await this.repository.getSolicitudInicialById(solicitudId);
        if (!solicitud) {
            throw new Error("Solicitud no encontrada");
        }

        // 2. Verificar si ya está aprobada/rechazada
        if (solicitud.getEstado() !== "pendiente") {
            return solicitud;
        }

        try {
            // 3. Consultar Veraz
            const estadoVeraz = await this.verazService.checkClienteStatus(solicitud.getDniCliente());
            
            // 4. Actualizar estado según Veraz
            if (estadoVeraz.status === "aprobado") {
                solicitud.setEstado("aprobada");
            } else {
                solicitud.setEstado("rechazada");
            }

            // 5. Guardar cambios
            const updated = await this.repository.updateSolicitudInicial(solicitud);

            // 6. Notificar al comerciante
            await this.notificationService.emitNotification({
                userId: solicitud.getComercianteId() || 0,
                type: "solicitud_inicial",
                message: `Solicitud ${solicitudId} actualizada a estado: ${solicitud.getEstado()}`
            });

            return updated;
        } catch (error) {
            // Notificar error
            let errorMessage = "Error desconocido";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            await this.notificationService.emitNotification({
                userId: solicitud.getComercianteId() || 0,
                type: "error",
                message: `Error verificando aprobación: ${errorMessage}`
            });
            throw error;
        }
    }
}
