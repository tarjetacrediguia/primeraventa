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
 * - Asegurar motivo de rechazo válido (mín. 10 caracteres)
 * - Actualizar estado a "rechazada" con motivo
 * - Registrar analista que realiza el rechazo
 * - Registrar evento en historial con motivo y detalles
 * - Notificar al comerciante con motivo específico
 * - Manejar errores y excepciones
 * 
 * FLUJO PRINCIPAL:
 * 1. Validar existencia de compra
 * 2. Validar estado pendiente
 * 3. Validar motivo de rechazo
 * 4. Actualizar estado y motivo
 * 5. Persistir cambios
 * 6. Registrar evento en historial
 * 7. Notificar al comerciante
 */

import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { ClienteRepositoryPort } from "../../ports/ClienteRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { SolicitudInicialRepositoryPort } from "../../ports/SolicitudInicialRepositoryPort";

/**
 * Caso de uso para rechazar compras pendientes.
 * 
 * Esta clase implementa la lógica para que analistas puedan rechazar compras
 * pendientes, incluyendo validaciones de estado, motivo de rechazo, registro
 * de eventos y notificaciones correspondientes.
 */
export class RechazarCompraUseCase {
    /**
     * Constructor del caso de uso para rechazar compras.
     * 
     * @param compraRepository - Puerto para operaciones de compras
     * @param historialRepository - Puerto para registro de eventos en historial
     * @param notificationService - Puerto para servicios de notificación
     * @param solicitudFormalRepository - Puerto para operaciones de solicitudes formales
     * @param clienteRepository - Puerto para operaciones de clientes
     */
    constructor(
        private readonly compraRepository: CompraRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly clienteRepository: ClienteRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryPort
    ) {}

    /**
     * Ejecuta el rechazo de una compra pendiente.
     * 
     * Este método implementa el flujo completo de rechazo de compra:
     * 1. Obtiene la compra por ID
     * 2. Valida estado pendiente
     * 3. Verifica motivo de rechazo (mín. 10 caracteres)
     * 4. Actualiza estado a rechazada con motivo
     * 5. Registra analista que realiza el rechazo
     * 6. Persiste cambios en base de datos
     * 7. Registra evento en historial con motivo y detalles
     * 8. Notifica al comerciante con motivo específico
     * 
     * VALIDACIONES REALIZADAS:
     * - Compra debe existir
     * - Compra debe estar en estado PENDIENTE
     * - Motivo debe tener al menos 10 caracteres
     * - Motivo no puede estar vacío o solo espacios
     * 
     * @param id - ID de la compra a rechazar
     * @param motivo - Motivo detallado del rechazo (mín. 10 caracteres)
     * @param usuarioId - ID del usuario que realiza el rechazo
     * @returns Promise<Compra> - Compra actualizada con estado rechazada
     * @throws Error - Si no se cumplen las validaciones o ocurre un error
     */
    async execute(id: number, motivo: string, usuarioId: number): Promise<Compra> {
        let solicitudInicialId: number | undefined;
        try {
            // ===== PASO 1: OBTENER Y VALIDAR COMPRA =====
            // Obtener la compra por ID
            const compra = await this.compraRepository.getCompraById(id);
            
            // Verificar que la compra existe
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

            // ===== VALIDACIÓN MÁS CLARA DE ESTADOS =====
            const estadoActual = compra.getEstado();
            if (estadoActual !== EstadoCompra.PENDIENTE && estadoActual !== EstadoCompra.APROBADA) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(compra.getId());
                
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: `Estado inválido para rechazo: ${estadoActual}`,
                        estado_actual: estadoActual,
                        estados_permitidos: ['pendiente', 'aprobada']
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error(
                    `Solo se pueden rechazar compras pendientes o aprobadas. Estado actual: ${estadoActual}`
                );
            }
            
            // Obtener solicitudInicialId para usar en registros
            solicitudInicialId = await this.obtenerSolicitudInicialId(compra.getId());

            

            // ===== PASO 3: VALIDAR MOTIVO DE RECHAZO =====
            // Validar que el motivo tenga al menos 10 caracteres
            console.log(motivo)
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

            // ===== PASO 4: ACTUALIZAR ESTADO Y MOTIVO =====
            // Actualizar estado a rechazada y establecer motivo
            compra.setEstado(EstadoCompra.RECHAZADA);
            compra.setMotivoRechazo(motivo);
            compra.setAnalistaAprobadorId(usuarioId); // Registrar quien rechaza
            
            // ===== PASO 5: PERSISTIR CAMBIOS =====
            // Guardar los cambios en la base de datos
            const compraActualizada = await this.compraRepository.updateCompra(compra, compra.getClienteId());

            // ===== RECHAZO EN CASCADA DE SOLICITUDES ASOCIADAS =====
            await this.rechazarSolicitudesAsociadas(compraActualizada, motivo, usuarioId);

            // ===== PASO 6: OBTENER DATOS PARA NOTIFICACIÓN =====
            // Obtener solicitud formal para notificar al comerciante
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(
                compra.getSolicitudFormalId()
            );
            
            // ===== PASO 7: REGISTRAR EVENTO EN HISTORIAL =====
            // Registrar rechazo exitoso en historial
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

            // ===== PASO 8: NOTIFICAR AL COMERCIANTE =====
            const cliente = await this.clienteRepository.findById(compra.getClienteId());
      const cuilCliente = cliente.getCuil();
            // Enviar notificación al comerciante sobre el rechazo
            if (solicitudFormal) {
                await this.notificationService.emitNotification({
                    userId: solicitudFormal.getComercianteId(),
                    type: "compra",
                    message: `Compra rechazada: ${compra.getDescripcion()} - CUIL: ${cuilCliente}`,
                    metadata: {
                        compraId: id,
                        motivo: motivo,
                        estado: "rechazada"
                    }
                });
            }

            // Retornar la compra actualizada exitosamente
            return compraActualizada;
        } catch (error) {
            // ===== MANEJO DE ERRORES =====
            // Obtener solicitudInicialId si no se había obtenido antes
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(id);
            }
            
            // Registrar evento de error en historial
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
            
            // Notificar error al usuario
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al rechazar compra ${id}: ${error instanceof Error ? error.message : String(error)}`
            });
            
            // Re-lanzar el error para que sea manejado por el controlador
            throw error;
        }
    }


    /**
     * Rechaza en cascada las solicitudes formales e iniciales asociadas
     */
    private async rechazarSolicitudesAsociadas(
        compra: Compra, 
        motivoCompra: string, 
        usuarioId: number
    ): Promise<void> {
        try {
            // Obtener solicitud formal asociada
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(
                compra.getSolicitudFormalId()
            );

            if (!solicitudFormal) {
                console.warn(`No se encontró solicitud formal para la compra ${compra.getId()}`);
                return;
            }

            const solicitudInicialId = solicitudFormal.getSolicitudInicialId();
            const motivo = `Rechazada automáticamente por rechazo de compra. Motivo: ${motivoCompra}`;

            // Rechazar solicitud formal si está en estados pendientes
            // Estados válidos según BD: 'pendiente', 'pendiente_ampliacion'
            const estadosPendientesFormal = ['pendiente', 'pendiente_ampliacion'];
            
            if (estadosPendientesFormal.includes(solicitudFormal.getEstado())) {
                
                solicitudFormal.setEstado('rechazada');
                solicitudFormal.agregarComentario(motivo);
                solicitudFormal.setAnalistaAprobadorId(usuarioId);
                
                await this.solicitudFormalRepository.updateSolicitudFormal(solicitudFormal);

                // Registrar en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.RECHAZAR_SOLICITUD_FORMAL_AUTOMATICO,
                    entidadAfectada: 'solicitudes_formales',
                    entidadId: solicitudFormal.getId(),
                    detalles: {
                        motivo: motivo,
                        compra_id: compra.getId(),
                        estado_anterior: solicitudFormal.getEstado(),
                        accion: "rechazo_automatico_por_compra"
                    },
                    solicitudInicialId: solicitudInicialId
                });

                console.log(`✅ Solicitud formal ${solicitudFormal.getId()} rechazada automáticamente por rechazo de compra. Estado anterior: ${solicitudFormal.getEstado()}`);
            } else {
                console.log(`ℹ️ Solicitud formal ${solicitudFormal.getId()} no se rechazó automáticamente porque su estado es: ${solicitudFormal.getEstado()}`);
            }

            // Rechazar solicitud inicial si está pendiente
            // Estados válidos según BD: 'pendiente' (no rechazamos 'aprobada', 'rechazada', 'expirada')
            const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitudInicialId);
            
            if (solicitudInicial && solicitudInicial.getEstado() === 'pendiente') {
                // Obtener cliente para la actualización
                const cliente = await this.clienteRepository.findById(solicitudInicial.getClienteId());
                
                if (cliente) {
                    solicitudInicial.setEstado('rechazada');
                    solicitudInicial.setMotivoRechazo(motivo);
                    solicitudInicial.agregarComentario(motivo);
                    solicitudInicial.setAnalistaAprobadorId(usuarioId);
                    
                    await this.solicitudInicialRepository.updateSolicitudInicialAprobaciónRechazo(
                        solicitudInicial, 
                        cliente
                    );

                    // Registrar en historial
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.RECHAZAR_SOLICITUD_INICIAL_AUTOMATICO,
                        entidadAfectada: 'solicitudes_iniciales',
                        entidadId: solicitudInicialId,
                        detalles: {
                            motivo: motivo,
                            compra_id: compra.getId(),
                            estado_anterior: solicitudInicial.getEstado(),
                            accion: "rechazo_automatico_por_compra"
                        },
                        solicitudInicialId: solicitudInicialId
                    });

                    console.log(`✅ Solicitud inicial ${solicitudInicialId} rechazada automáticamente por rechazo de compra`);
                }
            } else if (solicitudInicial) {
                console.log(`ℹ️ Solicitud inicial ${solicitudInicialId} no se rechazó automáticamente porque su estado es: ${solicitudInicial.getEstado()}`);
            }

        } catch (error) {
            console.error('❌ Error en rechazo en cascada de solicitudes:', error);
            // No lanzamos el error para no interrumpir el flujo principal de rechazo de compra
            // Pero registramos el error en el historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'compras',
                entidadId: compra.getId(),
                detalles: {
                    error: `Error en rechazo en cascada: ${error instanceof Error ? error.message : String(error)}`,
                    etapa: "rechazo_cascada_solicitudes"
                },
                solicitudInicialId: await this.obtenerSolicitudInicialId(compra.getId())
            });
        }
    }


    /**
     * Método auxiliar para obtener el ID de la solicitud inicial asociada a una compra.
     * 
     * Este método privado se encarga de obtener el ID de la solicitud inicial
     * a través de la cadena de relaciones: Compra -> SolicitudFormal -> SolicitudInicial.
     * Se utiliza para registrar eventos en el historial con el contexto correcto.
     * 
     * @param compraId - ID de la compra para buscar la solicitud inicial asociada
     * @returns Promise<number | undefined> - ID de la solicitud inicial o undefined si no se encuentra
     */
    private async obtenerSolicitudInicialId(compraId: number): Promise<number | undefined> {
        try {
            const solicitudFormalId = await this.compraRepository.getSolicitudFormalIdByCompraId(compraId);
            
            if (!solicitudFormalId) return undefined;
            
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            
            return solicitudFormal?.getSolicitudInicialId();
        } catch (e) {
            console.error("Error obteniendo solicitudInicialId", e);
            return undefined;
        }
    }
}

