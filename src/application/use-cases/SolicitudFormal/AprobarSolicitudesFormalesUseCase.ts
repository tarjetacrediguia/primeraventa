// src/application/use-cases/SolicitudFormal/AprobarSolicitudesFormalesUseCase.ts
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormal } from "../../../domain/entities/SolicitudFormal";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";

export class AprobarSolicitudesFormalesUseCase {
    constructor(
        private readonly repository: SolicitudFormalRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly historialRepository: HistorialRepositoryPort
    ) {}

    async aprobarSolicitud(
        solicitudId: number,
        numeroTarjeta: string,
        numeroCuenta: string,
        aprobadorId: number,
        esAdministrador: boolean,
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

        if (esAdministrador) {
            solicitud.setAdministradorAprobadorId(aprobadorId);
        } else {
            solicitud.setAnalistaAprobadorId(aprobadorId);
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
        
        // 3. Agregar comentario si existe
        if (comentario) {
            solicitud.agregarComentario(`Aprobación: ${comentario}`);
        }
        
        // 4. Actualizar estado
        solicitud.setEstado("aprobada");
        solicitud.setNumeroTarjeta(numeroTarjeta);
        solicitud.setNumeroCuenta(numeroCuenta);
        
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
                    numero_tarjeta: numeroTarjeta,
                    numero_cuenta: numeroCuenta,
                    comentario: comentario || ""
                },
                    solicitudInicialId: solicitudInicialId
            });
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

    private async notificarCliente(solicitud: SolicitudFormal, mensaje: string): Promise<void> {
        await this.notificationService.emitNotification({
            userId: solicitud.getComercianteId(), // Referencia al cliente
            type: "solicitud_formal",
            message: mensaje
        });
    }
}
