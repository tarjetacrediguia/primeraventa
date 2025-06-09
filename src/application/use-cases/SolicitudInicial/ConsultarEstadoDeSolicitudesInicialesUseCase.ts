// src/application/use-cases/SolicitudInicial/ConsultarEstadoDeSolicitudesInicialesUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { NotificationPort } from "../../ports/NotificationPort";

export class ConsultarEstadoDeSolicitudesInicialesUseCase {
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly notificationService: NotificationPort
    ) {}

    async execute(comercianteId: string): Promise<SolicitudInicial[]> {
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