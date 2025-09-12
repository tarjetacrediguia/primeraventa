// src/application/use-cases/Compra/RechazarCompraUseCase.ts

/**
 * MÓDULO: Caso de Uso - Rechazar Compra
 *
 * Este módulo implementa la lógica para rechazar una compra pendiente.
 * Incluye validaciones, registro de motivo, historial y notificaciones
 * personalizadas al comerciante y cliente.
 *
 * RESPONSABILIDADES:
 * - Validar existencia y estado de la compra
 * - Asegurar motivo de rechazo válido
 * - Actualizar estado a "rechazada"
 * - Registrar evento en historial con motivo
 * - Notificar a comerciante y cliente con el motivo
 * - Manejar errores y excepciones
 */

import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";

export class RechazarCompraUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly clienteRepository: ClienteRepositoryPort
    ) {}

    /**
     * Ejecuta el rechazo de una compra pendiente.
     * 
     * Flujo completo:
     * 1. Obtiene la compra por ID
     * 2. Valida estado pendiente
     * 3. Verifica motivo de rechazo
     * 4. Actualiza estado a rechazada
     * 5. Registra evento en historial con motivo
     * 6. Notifica a comerciante y cliente con el motivo
     * 
     * @param id - ID de la compra a rechazar
     * @param motivo - Motivo detallado del rechazo
     * @param usuarioId - ID del usuario que realiza el rechazo
     * @returns Promise<Compra> - Compra actualizada
     * @throws Error - Si no se cumplen validaciones
     */
    async execute(id: number, motivo: string, usuarioId: number): Promise<Compra> {
        let solicitudInicialId: number | undefined;
        try {
            // 1. Obtener compra por ID
            const compra = await this.compraRepository.getCompraById(id);
            
            if (!compra) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(id);
                // Registrar evento de error
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: `Compra no encontrada: ${id}`,
                        etapa: "obtencion_compra"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error(`No existe una compra con ID: ${id}`);
            }
            // Obtener solicitudInicialId para usar en registros
            solicitudInicialId = await this.obtenerSolicitudInicialId(compra.getId());

            // 2. Validar estado actual
            if (compra.getEstado() !== EstadoCompra.PENDIENTE) {
                // Registrar evento de estado inválido
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: `Estado inválido para rechazo: ${compra.getEstado()}`,
                        estado_actual: compra.getEstado()
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error(`Solo se pueden rechazar compras pendientes. Estado actual: ${compra.getEstado()}`);
            }

            // 3. Validar motivo de rechazo
            if (!motivo || motivo.trim().length < 10) {
                // Registrar evento de motivo inválido
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: "Motivo de rechazo inválido",
                        motivo_provisto: motivo
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Debe proporcionar un motivo de rechazo válido (mínimo 10 caracteres)");
            }

            // 4. Actualizar estado
            compra.setEstado(EstadoCompra.RECHAZADA);
            compra.setMotivoRechazo(motivo);
            compra.setAnalistaAprobadorId(usuarioId); // Registrar quien rechaza
            // 5. Guardar cambios
            const compraActualizada = await this.compraRepository.updateCompra(compra, compra.getClienteId());

            // 6. Obtener datos para notificación
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(
                compra.getSolicitudFormalId()
            );
            
            // 7. Registrar rechazo en historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.RECHAZAR_COMPRA,
                entidadAfectada: 'compras',
                entidadId: id,
                detalles: {
                    motivo: motivo,
                    monto_total: compra.getMontoTotal(),
                    cantidad_cuotas: compra.getCantidadCuotas()
                },
                solicitudInicialId: solicitudInicialId
            });

            // 8. Notificar al comerciante
            if (solicitudFormal) {
                await this.notificationService.emitNotification({
                    userId: solicitudFormal.getComercianteId(),
                    type: "compra",
                    message: `Compra rechazada: ${compra.getDescripcion()}`,
                    metadata: {
                        compraId: id,
                        motivo: motivo,
                        estado: "rechazada"
                    }
                });
            }

            return compraActualizada;
        } catch (error) {
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(id);
            }
            // Registrar evento de error
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'compras',
                entidadId: id,
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "rechazo_compra"
                },
                solicitudInicialId: solicitudInicialId
            });
            
            // Notificar error
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al rechazar compra ${id}: ${error instanceof Error ? error.message : String(error)}`
            });
            
            throw error;
        }
    }
    /**
     * Método auxiliar para obtener solicitudInicialId
     */
    private async obtenerSolicitudInicialId(compraId: number): Promise<number | undefined> {
        try {
            // Obtener ID de solicitud formal
            const solicitudFormalId = await this.compraRepository.getSolicitudFormalIdByCompraId(compraId);
            
            if (!solicitudFormalId) return undefined;
            
            // Obtener solicitud formal
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            
            return solicitudFormal?.getSolicitudInicialId();
        } catch (e) {
            console.error("Error obteniendo solicitudInicialId", e);
            return undefined;
        }
    }

}