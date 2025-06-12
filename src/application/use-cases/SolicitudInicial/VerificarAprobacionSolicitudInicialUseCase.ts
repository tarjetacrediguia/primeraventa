// src/application/use-cases/SolicitudInicial/VerificarAprobacionSolicitudInicialUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { VerazPort } from "../../ports/VerazPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";

export class VerificarAprobacionSolicitudInicialUseCase {
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly verazService: VerazPort,
        private readonly notificationService: NotificationPort
    ) {}

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