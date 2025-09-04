// src/application/use-cases/Compra/CrearCompraUseCase.ts


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
 * - Crear entidad Compra
 * - Guardar en repositorio
 * - Registrar evento en historial
 * - Notificar a analistas para revisión
 * - Manejar errores y excepciones
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
     * 4. Crea entidad Compra
     * 5. Guarda en repositorio
     * 6. Registra en historial
     * 7. Notifica a analistas para revisión
     * 
     * @param solicitudFormalId - ID de solicitud formal asociada
     * @param descripcion - Descripción general de la compra
     * @param cantidadCuotas - Número de cuotas (3-14)
     * @param montoTotal - Monto total de la compra
     * @param usuarioId - ID del usuario que crea la compra
     * @returns Promise<Compra> - Compra creada
     * @throws Error - Si no se cumplen validaciones
     */
    async execute(
        solicitudFormalId: number,
        descripcion: string,
        cantidadCuotas: number,
        montoTotal: number,
        usuarioId: number,
    ): Promise<Compra> {
        let solicitudInicialId: number | undefined;
        try {
            // 1. Validar solicitud formal
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            if (!solicitudFormal) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
                // Registrar evento de error
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
            const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitudFormal.getSolicitudInicialId());
            if (!solicitudInicial) {
                throw new Error(`Solicitud inicial no encontrada para ID: ${solicitudFormal.getSolicitudInicialId()}`);
            }
            
            if (solicitudFormal.getEstado() !== "aprobada") {
                // Registrar evento de estado inválido
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

            // 2. Validar cantidad de cuotas
            if (cantidadCuotas < 3 || cantidadCuotas > 14) {
                // Registrar evento de error
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

            // 3. Validar monto total
            if (montoTotal <= 0) {
                // Registrar evento de error
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

            // 4. Verificar que el monto no exceda el límite de crédito
            if (montoTotal > solicitudFormal.getLimiteCompleto()) {
                // Caso 1: Si no tiene solicitud de ampliación -> ERROR
                if (!solicitudFormal.getSolicitaAmpliacionDeCredito()) {
                    // Registrar evento de error
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
                // Caso 2: Si tiene solicitud de ampliación -> Continuar
                else {
                    solicitudFormal.setNuevoLimiteCompletoSolicitado(montoTotal);
                    await this.solicitudFormalRepository.updateSolicitudFormal(solicitudFormal);
                    // Registrar evento informativo
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

            // 5. Crear entidad Compra
            const compra = new Compra({
                id: 0, // ID temporal, se asignará al guardar
                solicitudFormalId: solicitudFormalId,
                descripcion: descripcion,
                cantidadCuotas: cantidadCuotas,
                estado: EstadoCompra.PENDIENTE,
                montoTotal: montoTotal,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                valorCuota: cantidadCuotas > 0 ? montoTotal / cantidadCuotas : 0,
                clienteId: solicitudFormal.getClienteId(),
                comercianteId: usuarioId, // Asignar comerciante actual
            });

            // 6. Guardar en repositorio
            const compraCreada = await this.compraRepository.saveCompra(compra, solicitudFormal.getClienteId());

            // 7. Registrar creación en historial
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

            // 8. Notificar a analistas para revisión
            await this.notificarAnalistas(compraCreada, usuarioId, solicitudInicial.getId());

            return compraCreada;
        } catch (error) {
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
            }
            // Registrar evento de error
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
            
            // Notificar error
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al crear compra: ${error instanceof Error ? error.message : String(error)}`
            });
            
            throw error;
        }
    }

    /**
     * Método auxiliar para obtener solicitudInicialId
     */
    private async obtenerSolicitudInicialId(solicitudFormalId: number): Promise<number | undefined> {
        try {
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            if (solicitudFormal) {
                const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(
                    solicitudFormal.getSolicitudInicialId()
                );
                return solicitudInicial?.getId();
            }
        } catch (e) {
            console.error("Error obteniendo solicitudInicialId", e);
        }
        return undefined;
    }

    /**
     * Notifica a analistas sobre nueva compra pendiente de revisión
     * 
     * @param compra - Compra creada
     * @param usuarioId - ID del usuario creador
     */
    private async notificarAnalistas(compra: Compra, usuarioId: number, solicitudInicialId: number | undefined): Promise<void> {
        try {
            const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();
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
            
            await Promise.all(notificaciones);
        } catch (error) {
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



/*


import { Compra, EstadoCompra } from "../../../domain/entities/Compra";
//import { ItemCompra } from "../../../domain/entities/ItemCompra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { NotificationPort } from "../../ports/NotificationPort";
import { AnalistaRepositoryPort } from "../../ports/AnalistaRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { SolicitudInicialRepositoryAdapter } from "../../../infrastructure/adapters/repository/SolicitudInicialRepositoryAdapter";

export class CrearCompraUseCase {
    constructor(
        private readonly compraRepository: CompraRepositoryPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly notificationService: NotificationPort,
        private readonly analistaRepo: AnalistaRepositoryPort,
        private readonly solicitudInicialRepository: SolicitudInicialRepositoryAdapter
    ) {}


    async execute(
        solicitudFormalId: number,
        descripcion: string,
        cantidadCuotas: number,
        montoTotal: number,
        usuarioId: number,
    ): Promise<Compra> {
        let solicitudInicialId: number | undefined;
        try {
            // 1. Validar solicitud formal
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            if (!solicitudFormal) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
                // Registrar evento de error
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
            const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(solicitudFormal.getSolicitudInicialId());
            if (!solicitudInicial) {
                throw new Error(`Solicitud inicial no encontrada para ID: ${solicitudFormal.getSolicitudInicialId()}`);
            }
            
            if (solicitudFormal.getEstado() !== "aprobada") {
                // Registrar evento de estado inválido
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

            // 2. Validar cantidad de cuotas
            if (cantidadCuotas < 3 || cantidadCuotas > 14) {
                // Registrar evento de error
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

            // 3. Validar items
            if (!items || items.length === 0) {
                // Registrar evento de error
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: 0,
                    detalles: {
                        error: "Compra sin items"
                    },
                    solicitudInicialId: solicitudInicial.getId()
                });
                throw new Error("La compra debe tener al menos un item");
            }

            for (const [index, item] of items.entries()) {
                if (!item.nombre || item.nombre.trim() === "") {
                    // Registrar evento de error
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            error: `Item ${index + 1} sin nombre`
                        },
                    solicitudInicialId: solicitudInicial.getId()
                    });
                    throw new Error(`El item ${index + 1} no tiene nombre`);
                }
                if (item.precio <= 0) {
                    // Registrar evento de error
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            error: `Precio inválido en item '${item.nombre}'`,
                            precio_provisto: item.precio
                        },
                    solicitudInicialId: solicitudInicial.getId()
                    });
                    throw new Error(`El precio del item '${item.nombre}' debe ser mayor que cero`);
                }
                if (item.cantidad <= 0) {
                    // Registrar evento de error
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            error: `Cantidad inválida en item '${item.nombre}'`,
                            cantidad_provista: item.cantidad
                        },
                    solicitudInicialId: solicitudInicial.getId()
                    });
                    throw new Error(`La cantidad del item '${item.nombre}' debe ser mayor que cero`);
                }
            }
            

            // 4. Crear entidad Compra
             const montoTotalReal = items.reduce(
                (total, item) => total + (item.precio * item.cantidad), 
                0
            );
            console.log(`Monto total real: ${montoTotalReal}`);

            if (montoTotalReal > solicitudFormal.getLimiteCompleto()) {
                // Caso 1: Si no tiene solicitud de ampliación -> ERROR
                if (!solicitudFormal.getSolicitaAmpliacionDeCredito()) {
                    // Registrar evento de error
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            error: "Monto excede límite de crédito",
                            montoTotalReal: montoTotalReal,
                            limite_credito: solicitudFormal.getLimiteCompleto(),
                            tiene_ampliacion: false
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                    
                    throw new Error(`El monto (${montoTotalReal}) excede el límite de crédito (${solicitudFormal.getLimiteCompleto()}). Solicite ampliación primero.`);
                }
                // Caso 2: Si tiene solicitud de ampliación -> Continuar
                else {
                    solicitudFormal.setNuevoLimiteCompletoSolicitado(montoTotalReal);
                    await this.solicitudFormalRepository.updateSolicitudFormal(solicitudFormal);
                    // Registrar evento informativo
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.COMPRA_CON_AMPLIACION_PENDIENTE,
                        entidadAfectada: 'compras',
                        entidadId: 0,
                        detalles: {
                            monto_ampliado: montoTotalReal,
                            limite_credito: solicitudFormal.getLimiteCompleto(),
                            nuevo_limite_solicitado: solicitudFormal.getNuevoLimiteCompletoSolicitado()
                        },
                        solicitudInicialId: solicitudInicial.getId()
                    });
                }
            }

            const compra = new Compra({
                id: 0, // ID temporal, se asignará al guardar
                solicitudFormalId: solicitudFormalId,
                descripcion: descripcion,
                cantidadCuotas: cantidadCuotas,
                items: items.map(item => new ItemCompra(0, 0, item.nombre, item.precio, item.cantidad)),
                estado: EstadoCompra.PENDIENTE,
                montoTotal: montoTotalReal, // Monto real calculado
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                valorCuota: cantidadCuotas > 0 ? montoTotalReal / cantidadCuotas : 0,
                clienteId: solicitudFormal.getClienteId(),
                comercianteId: usuarioId, // Asignar comerciante actual
            }
                
            );

            // 5. Guardar en repositorio
            const compraCreada = await this.compraRepository.saveCompra(compra,solicitudFormal.getClienteId());

            // 6. Registrar creación en historial
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.CREATE_COMPRA,
                entidadAfectada: 'compras',
                entidadId: compraCreada.getId(),
                detalles: {
                    solicitud_formal_id: solicitudFormalId,
                    monto_total: compraCreada.getMontoTotal(),
                    cantidad_items: items.length
                },
                    solicitudInicialId: solicitudInicial.getId()
            });

            // 7. Notificar a analistas para revisión
            await this.notificarAnalistas(compraCreada, usuarioId, solicitudInicial.getId());

            return compraCreada;
        } catch (error) {
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(solicitudFormalId);
            }
            // Registrar evento de error
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
            
            // Notificar error
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al crear compra: ${error instanceof Error ? error.message : String(error)}`
            });
            
            throw error;
        }
    }

    private async obtenerSolicitudInicialId(solicitudFormalId: number): Promise<number | undefined> {
        try {
            const solicitudFormal = await this.solicitudFormalRepository.getSolicitudFormalById(solicitudFormalId);
            if (solicitudFormal) {
                const solicitudInicial = await this.solicitudInicialRepository.getSolicitudInicialById(
                    solicitudFormal.getSolicitudInicialId()
                );
                return solicitudInicial?.getId();
            }
        } catch (e) {
            console.error("Error obteniendo solicitudInicialId", e);
        }
        return undefined;
    }

    private async notificarAnalistas(compra: Compra, usuarioId: number, solicitudInicialId: number | undefined): Promise<void> {
        try {
            const analistaIds = await this.analistaRepo.obtenerIdsAnalistasActivos();
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
            
            await Promise.all(notificaciones);
        } catch (error) {
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
*/