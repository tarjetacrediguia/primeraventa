// src/application/use-cases/SolicitudInicial/AprobarRechazarSolicitudInicialUseCase.ts

/**
 * MÓDULO: Caso de Uso - Aprobar/Rechazar Solicitud Inicial
 *
 * Este módulo implementa la lógica de negocio para aprobar o rechazar solicitudes iniciales
 * de crédito por parte de analistas o administradores del sistema.
 *
 * RESPONSABILIDADES:
 * - Validar la existencia de la solicitud inicial
 * - Asignar aprobador/rechazador según su rol (administrador o analista)
 * - Procesar la aprobación con comentarios opcionales
 * - Procesar el rechazo con comentarios obligatorios (mín. 10 caracteres)
 * - Obtener y actualizar datos del cliente asociado
 * - Actualizar el estado y comentarios de la solicitud
 * - Registrar eventos en el historial del sistema
 * - Enviar notificaciones al comerciante sobre el resultado
 * - Validar comentarios obligatorios para rechazos
 * 
 * FLUJO PRINCIPAL:
 * 1. Validar existencia de solicitud inicial
 * 2. Asignar aprobador/rechazador según rol
 * 3. Obtener cliente asociado a la solicitud
 * 4. Procesar aprobación o rechazo
 * 5. Actualizar estado y comentarios
 * 6. Persistir cambios en base de datos
 * 7. Registrar evento en historial
 * 8. Notificar al comerciante
 */

import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudInicial } from "../../../domain/entities/SolicitudInicial";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { crearComentarioAnalista, crearComentarioComerciante } from "../../../infrastructure/utils/comentariosHelper";

/**
 * Caso de uso para aprobar o rechazar solicitudes iniciales de crédito.
 * 
 * Esta clase implementa la lógica para que analistas y administradores puedan
 * aprobar o rechazar solicitudes iniciales, incluyendo validaciones de estado,
 * registro de eventos y notificaciones correspondientes.
 */
export class AprobarRechazarSolicitudInicialUseCase {
    /**
     * Constructor del caso de uso para aprobar/rechazar solicitudes iniciales.
     * 
     * @param repository - Puerto para operaciones de solicitudes iniciales
     * @param notificationService - Puerto para servicios de notificación
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param clienteRepository - Puerto para operaciones de clientes
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
     * Este método valida que la solicitud exista, establece el aprobador según su rol
     * (administrador o analista), obtiene el cliente asociado, actualiza el estado a "aprobada"
     * y registra el evento correspondiente.
     * 
     * FLUJO DE APROBACIÓN:
     * 1. Obtener y validar solicitud inicial
     * 2. Asignar aprobador según rol
     * 3. Obtener cliente asociado
     * 4. Agregar comentario opcional
     * 5. Actualizar estado a "aprobada"
     * 6. Persistir cambios
     * 7. Registrar evento en historial
     * 8. Notificar al comerciante
     * 
     * VALIDACIONES REALIZADAS:
     * - Solicitud debe existir
     * - Comentario opcional (si se proporciona)
     * 
     * @param solicitudId - ID de la solicitud inicial a aprobar
     * @param aprobadorId - ID del usuario que aprueba la solicitud
     * @param esAdministrador - Indica si el aprobador es administrador (true) o analista (false)
     * @param comentario - Comentario opcional para la aprobación
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe o ocurre un error en el proceso
     */
    async aprobarSolicitud(
        solicitudId: number,
        aprobadorId: number,
        esAdministrador: boolean,
        comentario?: string
    ): Promise<SolicitudInicial> {
        // ===== PASO 1: OBTENER Y VALIDAR SOLICITUD INICIAL =====
        // Obtener la solicitud inicial por ID
        const solicitud = await this.repository.getSolicitudInicialById(solicitudId);

        // Verificar que la solicitud existe
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

        // ===== PASO 2: ASIGNAR APROBADOR SEGÚN ROL =====
        // Asignar el aprobador según su rol en el sistema
        if (esAdministrador) {
            solicitud.setAdministradorAprobadorId(aprobadorId);
        } else {
            solicitud.setAnalistaAprobadorId(aprobadorId);
        }
        
        // ===== PASO 3: OBTENER CLIENTE ASOCIADO =====
        // Obtener el cliente asociado a la solicitud
        const clienteId = solicitud.getClienteId();
        const cliente = await this.clienteRepository.findById(clienteId);
        
        // ===== PASO 4: AGREGAR COMENTARIO OPCIONAL =====
        // Agregar comentario de aprobación si se proporciona
        if (comentario) {
      // Comentario detallado para analistas
      solicitud.agregarComentario(crearComentarioAnalista(`Aprobación: ${comentario}`));
    }
    
    // Comentario genérico para comerciante
    const mensajeComerciante = esAdministrador 
      ? "aprobación manual / aprobado por administrador" 
      : "aprobación manual / aprobado por analista";
    solicitud.agregarComentario(crearComentarioComerciante(mensajeComerciante));
        
        // ===== PASO 5: ACTUALIZAR ESTADO =====
        // Cambiar estado de la solicitud a "aprobada"
        solicitud.setEstado("aprobada");
        
        // ===== PASO 6: PERSISTIR CAMBIOS =====
        // Guardar los cambios en la base de datos
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud, cliente);
        
        // ===== PASO 7: REGISTRAR EVENTO EN HISTORIAL =====
        // Registrar aprobación exitosa en historial
        await this.historialRepository.registrarEvento({
            usuarioId: aprobadorId,
            accion: HISTORIAL_ACTIONS.APPROVE_SOLICITUD_INICIAL,
            entidadAfectada: 'solicitudes_iniciales',
            entidadId: solicitudId,
            detalles: { comentario: comentario || "" },
            solicitudInicialId: solicitudId
        });

        // ===== PASO 8: NOTIFICAR AL COMERCIANTE =====
        // Enviar notificación al comerciante sobre la aprobación
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud inicial de crédito ha sido aprobada`
        );

        // Retornar la solicitud actualizada exitosamente
        return solicitudActualizada;
    }

    /**
     * Rechaza una solicitud inicial de crédito.
     * 
     * Este método valida que la solicitud exista, que se proporcione un comentario válido
     * (mínimo 10 caracteres), establece el rechazador según su rol, obtiene el cliente asociado
     * y actualiza el estado a "rechazada".
     * 
     * FLUJO DE RECHAZO:
     * 1. Obtener y validar solicitud inicial
     * 2. Validar comentario obligatorio (mín. 10 caracteres)
     * 3. Asignar rechazador según rol
     * 4. Obtener cliente asociado
     * 5. Agregar comentario con contexto
     * 6. Establecer motivo de rechazo
     * 7. Actualizar estado a "rechazada"
     * 8. Persistir cambios
     * 9. Registrar evento en historial
     * 10. Notificar al comerciante
     * 
     * VALIDACIONES REALIZADAS:
     * - Solicitud debe existir
     * - Comentario es obligatorio y debe tener al menos 10 caracteres
     * - Comentario no puede estar vacío o solo espacios
     * 
     * @param solicitudId - ID de la solicitud inicial a rechazar
     * @param comentario - Comentario obligatorio explicando el motivo del rechazo (mín. 10 caracteres)
     * @param aprobadorId - ID del usuario que rechaza la solicitud
     * @param esAdministrador - Indica si el rechazador es administrador (true) o analista (false)
     * @returns Promise<SolicitudInicial> - La solicitud inicial actualizada
     * @throws Error - Si la solicitud no existe, el comentario es inválido o ocurre un error
     */
    async rechazarSolicitud(
        solicitudId: number,
        comentario: string,
        aprobadorId: number,
        esAdministrador: boolean
    ): Promise<SolicitudInicial> {
        // ===== PASO 1: OBTENER Y VALIDAR SOLICITUD INICIAL =====
        // Obtener la solicitud inicial por ID
        const solicitud = await this.repository.getSolicitudInicialById(solicitudId);
        
        // Verificar que la solicitud existe
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

        // ===== PASO 2: VALIDAR COMENTARIO OBLIGATORIO =====
        // Validar que el comentario tenga al menos 10 caracteres
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

        // ===== PASO 3: ASIGNAR RECHAZADOR SEGÚN ROL =====
        // Asignar el rechazador según su rol en el sistema
        if (esAdministrador) {
            solicitud.setAdministradorAprobadorId(aprobadorId);
        } else {
            solicitud.setAnalistaAprobadorId(aprobadorId);
        }
        
        // ===== PASO 4: OBTENER CLIENTE ASOCIADO =====
        // Obtener el cliente asociado a la solicitud
        const clienteId = solicitud.getClienteId();
        const cliente = await this.clienteRepository.findById(clienteId);
        
        // ===== PASO 5: AGREGAR COMENTARIO CON CONTEXTO =====
        // Agregar comentario con información del rechazador
        const rol = esAdministrador ? 'administrador' : 'analista';
        solicitud.agregarComentario(crearComentarioAnalista(`Rechazo por ${rol}: ${comentario}`));

        // Comentario genérico para comerciante
        const mensajeComerciante = esAdministrador 
        ? "Rechazo manual / rechazo por administrador" 
        : "Rechazo manual / rechazo por analista";
        solicitud.agregarComentario(crearComentarioComerciante(mensajeComerciante));
        
        // ===== PASO 6: ESTABLECER MOTIVO DE RECHAZO =====
        // Establecer el motivo de rechazo en la solicitud
        solicitud.setMotivoRechazo(comentario);
        
        // ===== PASO 7: ACTUALIZAR ESTADO =====
        // Cambiar estado de la solicitud a "rechazada"
        solicitud.setEstado("rechazada");
        
        // ===== PASO 8: PERSISTIR CAMBIOS =====
        // Guardar los cambios en la base de datos
        const solicitudActualizada = await this.repository.updateSolicitudInicialAprobaciónRechazo(solicitud, cliente);
        
        // ===== PASO 9: REGISTRAR EVENTO EN HISTORIAL =====
        // Registrar rechazo exitoso en historial
        await this.historialRepository.registrarEvento({
            usuarioId: aprobadorId,
            accion: HISTORIAL_ACTIONS.REJECT_SOLICITUD_INICIAL,
            entidadAfectada: 'solicitudes_iniciales',
            entidadId: solicitudId,
            detalles: { comentario },
            solicitudInicialId: solicitudId
        });

        // ===== PASO 10: NOTIFICAR AL COMERCIANTE =====
        // Enviar notificación al comerciante sobre el rechazo
        await this.notificarCliente(
            solicitudActualizada, 
            `Su solicitud inicial ha sido rechazada. Motivo: ${comentario}`
        );

        // Retornar la solicitud actualizada exitosamente
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
