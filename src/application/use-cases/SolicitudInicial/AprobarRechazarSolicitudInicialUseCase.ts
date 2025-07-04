// src/application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase.ts
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

export class AprobarRechazarSolicitudInicialUseCase {
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    async aprobarSolicitud(
        solicitudId: number,
        aprobadorId: number,
        esAdministrador: boolean,
        comentario?: string
    ): Promise<SolicitudInicial> {
        const solicitud = await this.repository.getSolicitudInicialById(solicitudId);
        console.log("Aprobando solicitud:", solicitudId, "por usuario:", aprobadorId);
        console.log("Es administrador:", esAdministrador);
        console.log("Comentario:", comentario);
        console.log("Estado actual de la solicitud:", solicitud);

        if (!solicitud) {
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: solicitudId,
                detalles: { error: "Solicitud inicial no encontrada" },
                    solicitudInicialId: solicitudId
            });
            throw new Error("Solicitud inicial no encontrada");
        }

        if (solicitud.getEstado() !== "pendiente") {
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: solicitudId,
                detalles: {
                    error: "Estado no pendiente",
                    estado_actual: solicitud.getEstado()
                },
                    solicitudInicialId: solicitudId
            });
            throw new Error("Solo se pueden aprobar solicitudes pendientes");
        }

        if (esAdministrador) {
        solicitud.setAdministradorAprobadorId(aprobadorId);
    } else {
        solicitud.setAnalistaAprobadorId(aprobadorId);
    }

        if (comentario) solicitud.agregarComentario(`Aprobación: ${comentario}`);
        solicitud.setEstado("aprobada");
        
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud);
        console.log("Solicitud actualizada:", solicitudActualizada);
        await this.historialRepository.registrarEvento({
            usuarioId: aprobadorId,
            accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
            entidadAfectada: 'solicitudes_iniciales',
            entidadId: solicitudId,
            detalles: { comentario: comentario || "" },
                    solicitudInicialId: solicitudId
        });

        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud inicial de crédito ha sido aprobada`
        );

        return solicitudActualizada;
    }

    async rechazarSolicitud(
        solicitudId: number,
        comentario: string,
        aprobadorId: number,
        esAdministrador: boolean
    ): Promise<SolicitudInicial> {
        const solicitud = await this.repository.getSolicitudInicialById(solicitudId);
        if (!solicitud) {
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: solicitudId,
                detalles: { error: "Solicitud inicial no encontrada" },
                    solicitudInicialId: solicitudId
            });
            throw new Error("Solicitud inicial no encontrada");
        }

        if (solicitud.getEstado() !== "pendiente") {
            throw new Error("Solo se pueden rechazar solicitudes pendientes");
        }

        if (!comentario || comentario.trim().length < 10) {
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'solicitudes_iniciales',
                entidadId: solicitudId,
                detalles: { error: "Comentario inválido" },
                    solicitudInicialId: solicitudId
            });
            throw new Error("El comentario es obligatorio (mín. 10 caracteres)");
        }

        if (esAdministrador) {
        solicitud.setAdministradorAprobadorId(aprobadorId);
    } else {
        solicitud.setAnalistaAprobadorId(aprobadorId);
    }

        const rol = esAdministrador ? 'administrador' : 'analista';
        solicitud.agregarComentario(`Rechazo por ${rol}: ${comentario}`);
        solicitud.setEstado("rechazada");
        
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud);
        
        await this.historialRepository.registrarEvento({
            usuarioId: aprobadorId,
            accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
            entidadAfectada: 'solicitudes_iniciales',
            entidadId: solicitudId,
            detalles: { comentario },
                    solicitudInicialId: solicitudId
        });

        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud inicial ha sido rechazada. Motivo: ${comentario}`
        );

        return solicitudActualizada;
    }

    private async notificarCliente(solicitud: SolicitudInicial, mensaje: string): Promise<void> {
        if (solicitud.getComercianteId()) {
            await this.notificationService.emitNotification({
                userId: solicitud.getComercianteId()!,
                type: "solicitud_inicial",
                message: mensaje
            });
        }
    }
}