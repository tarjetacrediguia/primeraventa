// src/application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar/Rechazar Solicitudes Formales
 *
 * Este módulo implementa la lógica de negocio para aprobar o rechazar solicitudes
 * formales de crédito por parte de analistas o administradores del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar el estado de la solicitud formal antes de aprobar/rechazar
 * - Procesar la aprobación con datos de tarjeta y cuenta bancaria
 * - Procesar el rechazo con comentarios obligatorios
 * - Actualizar el estado y comentarios de la solicitud
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante sobre el resultado
 * - Validar comentarios obligatorios para rechazos
 */

import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";

/**
 * Caso de uso para aprobar o rechazar solicitudes formales de crédito.
 * 
 * Esta clase implementa la lógica para que analistas y administradores puedan
 * aprobar o rechazar solicitudes formales, incluyendo la asignación de datos
 * bancarios para aprobaciones y comentarios detallados para rechazos.
 */
export class AprobarSolicitudesFormalesUseCase {
    /**
     * Constructor del caso de uso.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     * @param notificationService - Puerto para servicios de notificación
     * @param historialRepository - Puerto para registro de eventos en historial
     */
    constructor(
        private readonly repository: SolicitudFormalRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly compraRepository: CompraRepositoryPort
    ) {}

    /**
     * Aprueba una solicitud formal de crédito.
     * 
     * Este método valida que la solicitud exista y esté en estado pendiente,
     * establece el aprobador según su rol (administrador o analista),
     * asigna los datos bancarios (tarjeta y cuenta) y actualiza el estado a "aprobada".
     * 
     * @param solicitudId - ID de la solicitud formal a aprobar
     * @param numeroTarjeta - Número de tarjeta asignada al cliente
     * @param numeroCuenta - Número de cuenta bancaria asignada al cliente
     * @param aprobadorId - ID del usuario que aprueba la solicitud
     * @param esAdministrador - Indica si el aprobador es administrador (true) o analista (false)
     * @param comentario - Comentario opcional para la aprobación
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada
     * @throws Error - Si la solicitud no existe, no está pendiente o ocurre un error en el proceso
     */
    async aprobarSolicitud(
        solicitudId: number,
        aprobadorId: number,
        rol: string,
        comentario?: string
    ): Promise<SolicitudFormal> {
        
        // 1. Obtener solicitud formal
        const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
        const solicitudInicialId = solicitud?.getSolicitudInicialId();
        if (!solicitud) {
            // Registrar evento de solicitud no encontrada
                await this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Solicitud formal no encontrada",
                        solicitudId
                    },
                    solicitudInicialId: solicitudInicialId
                });
            throw new Error("Solicitud formal no encontrada");
        }

        //Asignar aprobador según su rol
        if (rol === 'administrador') {
            solicitud.setAdministradorAprobadorId(aprobadorId);
        } else if (rol === 'analista') {
            solicitud.setAnalistaAprobadorId(aprobadorId);
        } else if (rol === 'comerciante') {
            // Nuevo: asignar comerciante como aprobador
            solicitud.setComercianteAprobadorId(aprobadorId);
        }
        // 2. Verificar que esté en estado pendiente
        if (solicitud.getEstado() !== "pendiente") {
            // Registrar evento de estado inválido
                await this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Estado no pendiente",
                        estado_actual: solicitud.getEstado(),
                        estado_requerido: "pendiente"
                    },
                    solicitudInicialId: solicitudInicialId
                });
            throw new Error("Solo se pueden aprobar solicitudes pendientes");
        }

        //Validar completitud de datos
    try {
            solicitud.validarCompletitud();
        } catch (error) {
            await this.registrarErrorHistorial(
                aprobadorId,
                solicitudInicialId,
                solicitudId,
                "Datos incompletos en solicitud formal",
                { error: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error) }
            );
            const errorMsg = typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : String(error);
            throw new Error(`No se puede aprobar: ${errorMsg}`);
        }
        
        // 3. Agregar comentario si existe
        if (comentario) {
            solicitud.agregarComentario(`Aprobación: ${comentario}`);
        }
        solicitud.setEstado("aprobada");
        
        // 5. Guardar cambios
        const solicitudActualizada = await this.repository.updateSolicitudFormalAprobacion(solicitud);
        // Registrar aprobación exitosa
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_FORMAL,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitudId,
                detalles: {
                    nuevo_estado: "aprobada",
                    comentario: comentario || ""
                },
                    solicitudInicialId: solicitudInicialId
            });
        // 6. Notificar al cliente
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud formal de crédito ha sido aprobada.`
        );
        
        return solicitudActualizada;
    }

    private async registrarErrorHistorial(
        usuarioId: number,
        solicitudInicialId: number | undefined,
        entidadId: number,
        error: string,
        detalles?: any
    ): Promise<void> {
        await this.historialRepository.registrarEvento({
            usuarioId: usuarioId,
            accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
            entidadAfectada: 'solicitudes_formales',
            entidadId: entidadId,
            detalles: {
                error: error,
                ...detalles
            },
            solicitudInicialId: solicitudInicialId || 0 // Usar 0 si no está definido
        });
    }

    /**
     * Rechaza una solicitud formal de crédito.
     * 
     * Este método valida que la solicitud exista, esté en estado pendiente y
     * que se proporcione un comentario válido (mínimo 10 caracteres).
     * Establece el rechazador según su rol y actualiza el estado a "rechazada".
     * 
     * @param solicitudId - ID de la solicitud formal a rechazar
     * @param comentario - Comentario obligatorio explicando el motivo del rechazo (mín. 10 caracteres)
     * @param aprobadorId - ID del usuario que rechaza la solicitud
     * @param esAdministrador - Indica si el rechazador es administrador (true) o analista (false)
     * @returns Promise<SolicitudFormal> - La solicitud formal actualizada
     * @throws Error - Si la solicitud no existe, no está pendiente, el comentario es inválido o ocurre un error
     */
    async rechazarSolicitud(
    solicitudId: number,
    comentario: string,
    aprobadorId: number,
    esAdministrador: boolean
): Promise<SolicitudFormal> {
    // 1. Obtener solicitud formal
    const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
    const solicitudInicialId = solicitud?.getSolicitudInicialId();
    if (!solicitud) {
        // Registrar evento de solicitud no encontrada
                await this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Solicitud formal no encontrada",
                        solicitudId
                    },
                    solicitudInicialId: solicitudInicialId
                });
        throw new Error("Solicitud formal no encontrada");
    }
    
    // 2. Asignar aprobador según rol
    if (esAdministrador) {
        solicitud.setAdministradorAprobadorId(aprobadorId);
    } else {
        solicitud.setAnalistaAprobadorId(aprobadorId);
    }
    
    
    // 3. Verificar estado pendiente
    if (solicitud.getEstado() !== "pendiente") {
        throw new Error("Solo se pueden rechazar solicitudes pendientes");
    }
    
    // 4. Validar comentario
    if (!comentario || comentario.trim().length < 10) {
        // Registrar evento de comentario inválido
                await this.historialRepository.registrarEvento({
                    usuarioId: aprobadorId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudId,
                    detalles: {
                        error: "Comentario inválido",
                        comentario,
                        longitud: comentario?.trim().length || 0
                    },
                    solicitudInicialId: solicitudInicialId
                });
        throw new Error("El comentario es obligatorio y debe tener al menos 10 caracteres");
    }
    
    // 5. Agregar comentario con contexto
    const rol = esAdministrador ? 'administrador' : 'analista';
    const comentarioCompleto = `Rechazo por ${rol} ${aprobadorId}: ${comentario}`;
    solicitud.agregarComentario(comentarioCompleto);
    
    // 6. Actualizar estado
    solicitud.setEstado("rechazada");
    
    // 7. Guardar cambios usando la nueva función específica
    const solicitudActualizada = await this.repository.updateSolicitudFormalRechazo(solicitud);

    // Registrar rechazo exitoso
            await this.historialRepository.registrarEvento({
                usuarioId: aprobadorId,
                accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_FORMAL,
                entidadAfectada: 'solicitudes_formales',
                entidadId: solicitudId,
                detalles: {
                    nuevo_estado: "rechazada",
                    comentario: comentarioCompleto,
                    aprobador_rol: rol
                },
                    solicitudInicialId: solicitudInicialId
            });
    
    // 8. Notificar al cliente
    await this.notificarCliente(
        solicitudActualizada, 
        `Su solicitud formal de crédito ha sido rechazada. Comentario: ${comentario}`
    );
    
    return solicitudActualizada;
}

    /**
     * Envía notificación al comerciante sobre el resultado de su solicitud formal.
     * 
     * Este método privado se encarga de notificar al comerciante asociado a la solicitud
     * sobre el resultado de la aprobación o rechazo de su solicitud formal.
     * 
     * @param solicitud - La solicitud formal procesada
     * @param mensaje - Mensaje a enviar en la notificación
     * @returns Promise<void> - No retorna valor
     */
    private async notificarCliente(solicitud: SolicitudFormal, mensaje: string): Promise<void> {
        await this.notificationService.emitNotification({
            userId: solicitud.getComercianteId(), // Referencia al cliente
            type: "solicitud_formal",
            message: mensaje
        });
    }
}
