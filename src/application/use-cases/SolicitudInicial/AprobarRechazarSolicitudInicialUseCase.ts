// src/application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar/Rechazar Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para aprobar o rechazar solicitudes iniciales
 * de crédito por parte de analistas o administradores del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar el estado de la solicitud antes de aprobar/rechazar
 * - Procesar la aprobación o rechazo según el rol del usuario
 * - Actualizar el estado y comentarios de la solicitud
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante sobre el resultado
 * - Validar comentarios obligatorios para rechazos
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";

/**
 * Caso de uso para aprobar o rechazar solicitudes iniciales de crédito.
 * 
 * Esta clase implementa la lógica para que analistas y administradores puedan
 * aprobar o rechazar solicitudes iniciales, incluyendo validaciones de estado,
 * registro de eventos y notificaciones correspondientes.
 */
export class AprobarRechazarSolicitudInicialUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param notificationService - Puerto para servicios de notificación
     * @param historialRepository - Puerto para registro de eventos en historial
     */
    constructor(
        private readonly repository: SolicitudInicialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly clienteRepository: ClienteRepositoryPort
    ) {}

    /**
     * Aprueba una solicitud inicial de crédito.
     * 
     * Este método valida que la solicitud exista y esté en estado pendiente,
     * establece el aprobador según su rol (administrador o analista),
     * actualiza el estado a "aprobada" y registra el evento correspondiente.
     * 
     * @param solicitudId - ID de la solicitud inicial a aprobar
     * @param aprobadorId - ID del usuario que aprueba la solicitud
     * @param esAdministrador - Indica si el aprobador es administrador (true) o analista (false)
     * @param comentario - Comentario opcional para la aprobación
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe, no está pendiente o ocurre un error en el proceso
     */
    async aprobarSolicitud(
        solicitudId: number,
        aprobadorId: number,
        esAdministrador: boolean,
        comentario?: string
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
/*
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
*/
        if (esAdministrador) {
        solicitud.setAdministradorAprobadorId(aprobadorId);
    } else {
        solicitud.setAnalistaAprobadorId(aprobadorId);
    }
        //Obtener el cliente asociado a la solicitud
        const clienteId = solicitud.getClienteId();
        const cliente = await this.clienteRepository.findById(clienteId);
        if (comentario) solicitud.agregarComentario(`Aprobación: ${comentario}`);
        solicitud.setEstado("aprobada");
        
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud,cliente);
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

    /**
     * Rechaza una solicitud inicial de crédito.
     * 
     * Este método valida que la solicitud exista, esté en estado pendiente y
     * que se proporcione un comentario válido (mínimo 10 caracteres).
     * Establece el rechazador según su rol y actualiza el estado a "rechazada".
     * 
     * @param solicitudId - ID de la solicitud inicial a rechazar
     * @param comentario - Comentario obligatorio explicando el motivo del rechazo (mín. 10 caracteres)
     * @param aprobadorId - ID del usuario que rechaza la solicitud
     * @param esAdministrador - Indica si el rechazador es administrador (true) o analista (false)
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe, no está pendiente, el comentario es inválido o ocurre un error
     */
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
/*
        if (solicitud.getEstado() !== "pendiente") {
            throw new Error("Solo se pueden rechazar solicitudes pendientes");
        }
*/
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
        //Obtener el cliente asociado a la solicitud
        const clienteId = solicitud.getClienteId();
        const cliente = await this.clienteRepository.findById(clienteId);
        const rol = esAdministrador ? 'administrador' : 'analista';
        solicitud.agregarComentario(`Rechazo por ${rol}: ${comentario}`);
        solicitud.setMotivoRechazo(comentario);
        solicitud.setEstado("rechazada");
        
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud,cliente);
        
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

    /**
     * Envía notificación al comerciante sobre el resultado de su solicitud inicial.
     * 
     * Este método privado se encarga de notificar al comerciante asociado a la solicitud
     * sobre el resultado de la aprobación o rechazo de su solicitud inicial.
     * 
     * @param solicitud - La solicitud inicial procesada
     * @param mensaje - Mensaje a enviar en la notificación
     * @returns Promise<void> - No retorna valor
     */
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
