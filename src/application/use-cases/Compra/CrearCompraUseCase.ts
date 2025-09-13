// src/application/use-cases/Compra/CrearCompraUseCase.ts

/**
 * MÓDULO: Caso de Uso - Crear Compra
 *
 * Implementa la creación de una nueva compra asociada a una solicitud formal.
 * Incluye validaciones exhaustivas, registro en historial y notificaciones.
 *
 * RESPONSABILIDADES:
 * - Validar solicitud formal existente y aprobada
 * - Verificar rango de cuotas (3-14)
 * - Validar monto total de compra
 * - Verificar límites de crédito y ampliaciones
 * - Crear entidad Compra con estado PENDIENTE
 * - Guardar en repositorio
 * - Registrar evento en historial
 * - Notificar a analistas para revisión
 * - Manejar errores y excepciones
 * 
 * FLUJO PRINCIPAL:
 * 1. Validación de solicitud formal (existencia y estado)
 * 2. Validación de parámetros de entrada (cuotas y monto)
 * 3. Verificación de límites de crédito
 * 4. Creación de entidad Compra
 * 5. Persistencia en base de datos
 * 6. Registro de evento en historial
 * 7. Notificación a analistas
 */

import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { SolicitudInicialRepositoryAdapter } from "../../../infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter";

export class CrearCompraUseCase {
    /**
     * Constructor del caso de uso para crear compras
     * 
     * @param compraRepository - Repositorio para operaciones de compra
     * @param solicitudFormalRepository - Repositorio para operaciones de solicitud formal
     * @param historialRepository - Repositorio para registro de eventos en historial
     * @param notificationService - Servicio para envío de notificaciones
     * @param analistaRepo - Repositorio para operaciones de analistas
     * @param solicitudInicialRepository - Repositorio para operaciones de solicitud inicial
     */
    constructor(
        private readonly compraRepository: CompraRepositoryPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly analistaRepo: AnalistaRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryAdapter
    ) {}

    /**
     * Ejecuta la creación de una nueva compra.
     * 
     * Flujo completo:
     * 1. Valida solicitud formal existente y aprobada
     * 2. Verifica rango de cuotas (3-14)
     * 3. Valida monto total de compra
     * 4. Verifica límites de crédito y maneja ampliaciones
     * 5. Crea entidad Compra con estado PENDIENTE
     * 6. Guarda en repositorio
     * 7. Registra evento en historial
     * 8. Notifica a analistas para revisión
     * 
     * VALIDACIONES REALIZADAS:
     * - Solicitud formal debe existir y estar en estado "aprobada"
     * - Cantidad de cuotas debe estar entre 3 y 14
     * - Monto total debe ser mayor que cero
     * - Monto no debe exceder límite de crédito (a menos que tenga ampliación)
     * 
     * @param solicitudFormalId - ID de solicitud formal asociada
     * @param descripcion - Descripción general de la compra
     * @param cantidadCuotas - Número de cuotas (3-14)
     * @param montoTotal - Monto total de la compra
     * @param usuarioId - ID del usuario que crea la compra
     * @returns Promise<Compra> - Compra creada con estado PENDIENTE
     * @throws Error - Si no se cumplen las validaciones requeridas
     */
    async execute(
        solicitudFormalId: number,
        descripcion: string,
        cantidadCuotas: number,
        montoTotal: number,
        usuarioId: number,
    ): Promise<Compra> {
        // Variable para almacenar el ID de solicitud inicial para el historial
        let solicitudInicialId: number | undefined;
        
        try {
            // ===== PASO 1: VALIDACIÓN DE SOLICITUD FORMAL =====
            // Buscar la solicitud formal por ID
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            
            // Verificar que la solicitud formal existe
            if (!solicitudFormal) {
                // Obtener ID de solicitud inicial para el historial de errores
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
                
                // Registrar evento de error en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: 0,
                    detalles: {
                        error: `Solicitud formal no encontrada: ${solicitudFormalId}`,
                        etapa: "validacion_solicitud_formal"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error(`No existe una solicitud formal con ID: ${solicitudFormalId}`);
            }
            
            // Obtener la solicitud inicial asociada para validaciones adicionales
            const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitudFormal.getSolicitudInicialId());
            if (!solicitudInicial) {
                throw new Error(`Solicitud inicial no encontrada para ID: ${solicitudFormal.getSolicitudInicialId()}`);
            }
            
            // Verificar que la solicitud formal esté en estado "aprobada"
            if (solicitudFormal.getEstado() !== "aprobada") {
                // Registrar evento de estado inválido en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: 0,
                    detalles: {
                        error: `Solicitud formal no aprobada: ${solicitudFormal.getEstado()}`,
                        estado_actual: solicitudFormal.getEstado()
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                throw new Error(`La solicitud formal ${solicitudFormalId} no está aprobada.`);
            }

            // ===== PASO 2: VALIDACIÓN DE CANTIDAD DE CUOTAS =====
            // Verificar que la cantidad de cuotas esté dentro del rango permitido (3-14)
            if (cantidadCuotas < 3 || cantidadCuotas > 14) {
                // Registrar evento de error en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: 0,
                    detalles: {
                        error: "Cantidad de cuotas inválida",
                        cuotas_provistas: cantidadCuotas,
                        rango_permitido: "3-14"
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                throw new Error("La cantidad de cuotas debe estar entre 3 y 14");
            }

            // ===== PASO 3: VALIDACIÓN DE MONTO TOTAL =====
            // Verificar que el monto total sea válido (mayor que cero)
            if (montoTotal <= 0) {
                // Registrar evento de error en historial
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: 0,
                    detalles: {
                        error: "Monto total inválido",
                        monto_provisto: montoTotal
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                throw new Error("El monto total debe ser mayor que cero");
            }

            // ===== PASO 4: VALIDACIÓN DE LÍMITES DE CRÉDITO =====
            // Verificar que el monto no exceda el límite de crédito establecido
            if (montoTotal > solicitudFormal.getLimiteCompleto()) {
                // CASO 1: No tiene solicitud de ampliación de crédito -> ERROR
                if (!solicitudFormal.getSolicitaAmpliacionDeCredito()) {
                    // Registrar evento de error en historial
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            error: "Monto excede límite de crédito",
                            montoTotal: montoTotal,
                            limite_credito: solicitudFormal.getLimiteCompleto(),
                            tiene_ampliacion: false
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                    
                    throw new Error(`El monto (${montoTotal}) excede el límite de crédito (${solicitudFormal.getLimiteCompleto()}). Solicite ampliación primero.`);
                }
                // CASO 2: Tiene solicitud de ampliación de crédito -> CONTINUAR
                else {
                    // Actualizar el nuevo límite solicitado con el monto de la compra
                    solicitudFormal.setNuevoLimiteCompletoSolicitado(montoTotal);
                    await this.solicitudFormalRepository.updateSolicitudFormal(solicitudFormal);
                    
                    // Registrar evento informativo en historial
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.COMPRA_CON_AMPLIACION_PENDIENTE,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            monto_ampliado: montoTotal,
                            limite_credito: solicitudFormal.getLimiteCompleto(),
                            nuevo_limite_solicitado: solicitudFormal.getNuevoLimiteCompletoSolicitado()
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                }
            }

            // ===== PASO 5: CREACIÓN DE ENTIDAD COMPRA =====
            // Crear nueva instancia de Compra con estado PENDIENTE
            const compra = new Compra({
                id: 0, // ID temporal, se asignará automáticamente al guardar
                solicitudFormalId: solicitudFormalId,
                descripcion: descripcion,
                cantidadCuotas: cantidadCuotas,
                estado: EstadoCompra.PENDIENTE, // Estado inicial: pendiente de revisión
                montoTotal: montoTotal,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                valorCuota: cantidadCuotas > 0 ? montoTotal / cantidadCuotas : 0, // Calcular valor por cuota
                clienteId: solicitudFormal.getClienteId(),
                comercianteId: usuarioId, // Asignar comerciante que crea la compra
            });

            // ===== PASO 6: PERSISTENCIA EN BASE DE DATOS =====
            // Guardar la compra en el repositorio
            const compraCreada = await this.compraRepository.saveCompra(compra, solicitudFormal.getClienteId());

            // ===== PASO 7: REGISTRO EN HISTORIAL =====
            // Registrar evento de creación exitosa en historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.CREATE_COMPRA,
                entidadAfectada: 'compras',
                entidadId: compraCreada.getId(),
                detalles: {
                    solicitud_formal_id: solicitudFormalId,
                    monto_total: compraCreada.getMontoTotal(),
                    cantidad_cuotas: cantidadCuotas
                },
                solicitudInicialId: solicitudInicial.getId()
            });

            // ===== PASO 8: NOTIFICACIÓN A ANALISTAS =====
            // Notificar a analistas sobre nueva compra pendiente de revisión
            await this.notificarAnalistas(compraCreada, usuarioId, solicitudInicial.getId());

            // Retornar la compra creada exitosamente
            return compraCreada;
        } catch (error) {
            // ===== MANEJO DE ERRORES =====
            // Obtener ID de solicitud inicial si no se había obtenido antes
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
            }
            
            // Registrar evento de error en historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'compras',
                entidadId: 0,
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "creacion_compra",
                    solicitud_formal_id: solicitudFormalId
                },
                solicitudInicialId: solicitudInicialId
            });
            
            // Enviar notificación de error al usuario
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al crear compra: ${error instanceof Error ? error.message : String(error)}`
            });
            
            // Re-lanzar el error para que sea manejado por el controlador
            throw error;
        }
    }

    /**
     * Método auxiliar para obtener el ID de solicitud inicial asociada a una solicitud formal.
     * 
     * Este método se utiliza principalmente para el registro de eventos en el historial
     * cuando ocurren errores y necesitamos asociar el evento con la solicitud inicial.
     * 
     * @param solicitudFormalId - ID de la solicitud formal
     * @returns Promise<number | undefined> - ID de la solicitud inicial o undefined si no se encuentra
     */
    private async obtenerSolicitudInicialId(solicitudFormalId: number): Promise<number | undefined> {
        try {
            // Buscar la solicitud formal por ID
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            if (solicitudFormal) {
                // Obtener la solicitud inicial asociada
                const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(
                    solicitudFormal.getSolicitudInicialId()
                );
                return solicitudInicial?.getId();
            }
        } catch (e) {
            // Log del error pero no lanzar excepción para no interrumpir el flujo principal
            console.error("Error obteniendo solicitudInicialId", e);
        }
        return undefined;
    }

    /**
     * Notifica a analistas sobre nueva compra pendiente de revisión.
     * 
     * Este método obtiene todos los analistas activos del sistema y les envía
     * una notificación sobre la nueva compra que requiere revisión.
     * 
     * @param compra - Compra creada que requiere revisión
     * @param usuarioId - ID del usuario que creó la compra
     * @param solicitudInicialId - ID de la solicitud inicial asociada (opcional)
     */
    private async notificarAnalistas(compra: Compra, usuarioId: number, solicitudInicialId: number | undefined): Promise<void> {
        try {
            // Obtener IDs de todos los analistas activos
            const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();
            
            // Crear notificaciones para cada analista
            const notificaciones = analistaIds.map(analistaId => 
                this.notificationService.emitNotification({
                    userId: analistaId,
                    type: "compra",
                    message: "Nueva compra pendiente de revisión",
                    metadata: {
                        compraId: compra.getId(),
                        descripcion: compra.getDescripcion(),
                        monto: compra.getMontoTotal(),
                        prioridad: "media"
                    }
                })
            );
            
            // Enviar todas las notificaciones en paralelo
            await Promise.all(notificaciones);
        } catch (error) {
            // Registrar error en historial si falla la notificación
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'compras',
                entidadId: compra.getId(),
                detalles: {
                    error: "Error notificando a analistas",
                    error_detalle: error instanceof Error ? error.message : String(error)
                },
                solicitudInicialId: solicitudInicialId
            });
        }
    }
}