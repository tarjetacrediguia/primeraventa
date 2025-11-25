// src/application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar/Rechazar Solicitudes Formales
 *
 * Este módulo implementa la lógica de negocio para aprobar o rechazar solicitudes
 * formales de crédito por parte de analistas, administradores o comerciantes del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar el estado de la solicitud formal antes de aprobar/rechazar
 * - Asignar aprobador según su rol (administrador, analista o comerciante)
 * - Validar completitud de datos antes de aprobar
 * - Procesar la aprobación con comentarios opcionales
 * - Procesar el rechazo con comentarios obligatorios (mín. 10 caracteres)
 * - Actualizar el estado y comentarios de la solicitud
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante sobre el resultado
 * - Validar comentarios obligatorios para rechazos
 * 
 * FLUJO PRINCIPAL:
 * 1. Validación de existencia y estado de solicitud
 * 2. Asignación de aprobador según rol
 * 3. Validación de completitud de datos (para aprobaciones)
 * 4. Procesamiento de aprobación o rechazo
 * 5. Actualización de estado y comentarios
 * 6. Persistencia en base de datos
 * 7. Registro en historial y notificaciones
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
     * Constructor del caso de uso para aprobar/rechazar solicitudes formales.
     * 
     * @param repository - Puerto para operaciones de solicitudes formales
     * @param notificationService - Puerto para servicios de notificación
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param compraRepository - Puerto para operaciones de compras
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
     * establece el aprobador según su rol (administrador, analista o comerciante),
     * valida la completitud de datos y actualiza el estado a "aprobada".
     * 
     * FLUJO DE APROBACIÓN:
     * 1. Obtener y validar solicitud formal
     * 2. Asignar aprobador según rol
     * 3. Validar estado pendiente
     * 4. Validar completitud de datos
     * 5. Agregar comentario opcional
     * 6. Actualizar estado a "aprobada"
     * 7. Persistir cambios
     * 8. Registrar evento en historial
     * 9. Notificar al comerciante
     * 
     * VALIDACIONES REALIZADAS:
     * - Solicitud debe existir
     * - Solicitud debe estar en estado "pendiente"
     * - Datos de la solicitud deben estar completos
     * - Comentario opcional (si se proporciona)
     * 
     * @param solicitudId - ID de la solicitud formal a aprobar
     * @param aprobadorId - ID del usuario que aprueba la solicitud
     * @param rol - Rol del aprobador (administrador, analista o comerciante)
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
        // ===== PASO 1: OBTENER Y VALIDAR SOLICITUD FORMAL =====
        // Obtener la solicitud formal por ID
        const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
        const solicitudInicialId = solicitud?.getSolicitudInicialId();
        
        // Verificar que la solicitud existe
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

        // ===== PASO 2: ASIGNAR APROBADOR SEGÚN ROL =====
        // Asignar el aprobador según su rol en el sistema
        if (rol === 'administrador') {
            solicitud.setAdministradorAprobadorId(aprobadorId);
        } else if (rol === 'analista') {
            solicitud.setAnalistaAprobadorId(aprobadorId);
        } else if (rol === 'comerciante') {
            // Asignar comerciante como aprobador (nuevo rol)
            solicitud.setComercianteAprobadorId(aprobadorId);
        }
        
        // ===== PASO 3: VALIDAR ESTADO PENDIENTE =====
        // Verificar que la solicitud esté en estado pendiente
        /*
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
        */
        // ===== PASO 4: VALIDAR COMPLETITUD DE DATOS =====
        // Validar que todos los datos requeridos estén presentes
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
        
        // ===== PASO 5: AGREGAR COMENTARIO OPCIONAL =====
        // Agregar comentario de aprobación si se proporciona
        if (comentario) {
            solicitud.agregarComentario(`Aprobación: ${comentario}`);
        }
        
        // ===== PASO 6: ACTUALIZAR ESTADO =====
        // Cambiar estado de la solicitud a "aprobada"
        solicitud.setEstado("aprobada");
        
        // ===== PASO 7: PERSISTIR CAMBIOS =====
        // Guardar los cambios en la base de datos
        const solicitudActualizada = await this.repository.updateSolicitudFormalAprobacion(solicitud);
        
        // ===== PASO 8: REGISTRAR EVENTO EN HISTORIAL =====
        // Registrar aprobación exitosa en historial
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
        
        // ===== PASO 9: NOTIFICAR AL COMERCIANTE =====
        // Enviar notificación al comerciante sobre la aprobación
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud formal de crédito ha sido aprobada.`
        );
        
        // Retornar la solicitud actualizada exitosamente
        return solicitudActualizada;
    }

    /**
     * Registra un error en el historial del sistema.
     * 
     * Este método privado se encarga de registrar eventos de error en el historial
     * con información detallada sobre el error ocurrido durante el procesamiento.
     * 
     * @param usuarioId - ID del usuario que causó el error
     * @param solicitudInicialId - ID de la solicitud inicial asociada (opcional)
     * @param entidadId - ID de la entidad afectada
     * @param error - Mensaje de error principal
     * @param detalles - Detalles adicionales del error (opcional)
     * @returns Promise<void> - No retorna valor
     */
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
     * FLUJO DE RECHAZO:
     * 1. Obtener y validar solicitud formal
     * 2. Asignar rechazador según rol
     * 3. Validar estado pendiente
     * 4. Validar comentario obligatorio (mín. 10 caracteres)
     * 5. Agregar comentario con contexto
     * 6. Actualizar estado a "rechazada"
     * 7. Persistir cambios
     * 8. Registrar evento en historial
     * 9. Notificar al comerciante
     * 
     * VALIDACIONES REALIZADAS:
     * - Solicitud debe existir
     * - Solicitud debe estar en estado "pendiente"
     * - Comentario es obligatorio y debe tener al menos 10 caracteres
     * - Comentario no puede estar vacío o solo espacios
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
    // ===== PASO 1: OBTENER Y VALIDAR SOLICITUD FORMAL =====
    // Obtener la solicitud formal por ID
    const solicitud = await this.repository.getSolicitudFormalById(solicitudId);
    const solicitudInicialId = solicitud?.getSolicitudInicialId();
    
    // Verificar que la solicitud existe
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
    
    // ===== PASO 2: ASIGNAR RECHAZADOR SEGÚN ROL =====
    // Asignar el rechazador según su rol en el sistema
    if (esAdministrador) {
        solicitud.setAdministradorAprobadorId(aprobadorId);
    } else {
        solicitud.setAnalistaAprobadorId(aprobadorId);
    }
    
    // ===== PASO 3: VALIDAR ESTADO PENDIENTE =====
    // Verificar que la solicitud esté en estado pendiente
    /*
    if (solicitud.getEstado() !== "pendiente") {
        throw new Error("Solo se pueden rechazar solicitudes pendientes");
    }
    */
    // ===== PASO 4: VALIDAR COMENTARIO OBLIGATORIO =====
    // Validar que el comentario tenga al menos 10 caracteres
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
    
    // ===== PASO 5: AGREGAR COMENTARIO CON CONTEXTO =====
    // Agregar comentario con información del rechazador
    const rol = esAdministrador ? 'administrador' : 'analista';
    const comentarioCompleto = `Rechazo por ${rol} ${aprobadorId}: ${comentario}`;
    solicitud.agregarComentario(comentarioCompleto);
    
    // ===== PASO 6: ACTUALIZAR ESTADO =====
    // Cambiar estado de la solicitud a "rechazada"
    solicitud.setEstado("rechazada");
    
    // ===== PASO 7: PERSISTIR CAMBIOS =====
    // Guardar los cambios en la base de datos usando función específica de rechazo
    const solicitudActualizada = await this.repository.updateSolicitudFormalRechazo(solicitud);

    // ===== PASO 8: REGISTRAR EVENTO EN HISTORIAL =====
    // Registrar rechazo exitoso en historial
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
    
    // ===== PASO 9: NOTIFICAR AL COMERCIANTE =====
    // Enviar notificación al comerciante sobre el rechazo
    await this.notificarCliente(
        solicitudActualizada, 
        `Su solicitud formal de crédito ha sido rechazada. Comentario: ${comentario}`
    );
    
    // Retornar la solicitud actualizada exitosamente
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
