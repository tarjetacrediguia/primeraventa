// src/application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";

export class AprobarSolicitudesFormalesUseCase {
    constructor(
        private readonly repository: SolicitudFormalRepositoryPort,
        private readonly notificationService: NotificationPort
    ) {}

    async aprobarSolicitud(
        solicitudId: number,
        numeroTarjeta: string,
        numeroCuenta: string,
        comentario?: string
    ): Promise<SolicitudFormal> {
        // 1. Obtener solicitud formal
        const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
        if (!solicitud) {
            throw new Error("Solicitud formal no encontrada");
        }
        console.log("Solicitud formal encontrada:", solicitud);
        // 2. Verificar que esté en estado pendiente
        if (solicitud.getEstado() !== "pendiente") {
            throw new Error("Solo se pueden aprobar solicitudes pendientes");
        }
        
        // 3. Agregar comentario si existe
        if (comentario) {
            solicitud.agregarComentario(`Aprobación: ${comentario}`);
        }
        
        // 4. Actualizar estado
        solicitud.setEstado("aprobada");
        solicitud.setNumeroTarjeta(numeroTarjeta);
        solicitud.setNumeroCuenta(numeroCuenta);
        console.log("Solicitud formal actualizada:", solicitud);
        
        // 5. Guardar cambios
        const solicitudActualizada = await this.repository.updateSolicitudFormalAprobacion(solicitud);
        console.log("Solicitud formal actualizada:", solicitudActualizada);
        // 6. Notificar al cliente
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud formal de crédito ha sido aprobada. N° NumeroTarjeta: ${numeroTarjeta}, N° Cuenta: ${numeroCuenta}`
        );
        
        return solicitudActualizada;
    }

    async rechazarSolicitud(
        solicitudId: number,
        comentario: string,
        analistaId: number
    ): Promise<SolicitudFormal> {
        // 1. Obtener solicitud formal
        const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
        if (!solicitud) {
            throw new Error("Solicitud formal no encontrada");
        }
        
        // 2. Verificar que esté en estado pendiente
        if (solicitud.getEstado() !== "pendiente") {
            throw new Error("Solo se pueden rechazar solicitudes pendientes");
        }
        
        // 3. Validar comentario
        if (!comentario || comentario.trim().length < 10) {
            throw new Error("El comentario es obligatorio y debe tener al menos 10 caracteres");
        }
        
        // 4. Agregar comentario
        solicitud.agregarComentario(`Rechazo por analista ${analistaId}: ${comentario}`);
        
        // 5. Actualizar estado
        solicitud.setEstado("rechazada");
        
        // 6. Guardar cambios
        const solicitudActualizada = await this.repository.updateSolicitudFormal(solicitud);
        
        // 7. Notificar al cliente
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud formal de crédito ha sido rechazada. Comentario: ${comentario}`
        );
        
        return solicitudActualizada;
    }

    private async notificarCliente(solicitud: SolicitudFormal, mensaje: string): Promise<void> {
        await this.notificationService.emitNotification({
            userId: solicitud.getComercianteId(), // Referencia al cliente
            type: "solicitud_formal",
            message: mensaje
        });
    }
}