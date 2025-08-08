// src/application/use-cases/Compra/UpdateCompraUseCase.ts

import { Compra } from "../../../domain/entities/Compra";
import { CompraRepositoryPort } from "../../ports/CompraRepositoryPort";
import { ItemCompra } from "../../../domain/entities/ItemCompra";
import { HistorialRepositoryPort } from "../../ports/HistorialRepositoryPort";
import { SolicitudFormalRepositoryPort } from "../../ports/SolicitudFormalRepositoryPort";
import { HISTORIAL_ACTIONS } from "../../constants/historialActions";
import { NotificationPort } from "../../ports/NotificationPort";

export class UpdateCompraUseCase {
    constructor(
        private readonly repository: CompraRepositoryPort,
        private readonly historialRepository: HistorialRepositoryPort,
        private readonly solicitudFormalRepository: SolicitudFormalRepositoryPort,
        private readonly notificationService: NotificationPort
    ) {}

    async execute(
        id: number,
        descripcion: string,
        cantidadCuotas: number,
        items: { id?: number; nombre: string; precio: number; cantidad: number }[],
        usuarioId: number
    ): Promise<Compra> {
        // Variable para almacenar solicitudInicialId
        let solicitudInicialId: number | undefined;
        
        try {
            // Obtener la compra existente
            const compraExistente = await this.repository.getCompraById(id);
            if (!compraExistente) {
                // Intentar obtener solicitudInicialId
                solicitudInicialId = await this.obtenerSolicitudInicialId(id);
                
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: "Compra no encontrada",
                        etapa: "obtencion_compra"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("Compra no encontrada");
            }

            // Obtener solicitudInicialId para los registros
            solicitudInicialId = await this.obtenerSolicitudInicialId(compraExistente.getId());
            
            // Validar cuotas
            if (cantidadCuotas < 3 || cantidadCuotas > 14) {
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: "Cantidad de cuotas inválida",
                        cuotas_provistas: cantidadCuotas,
                        rango_permitido: "3-14"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("La cantidad de cuotas debe estar entre 3 y 14");
            }

            // Validar items
            if (!items || items.length === 0) {
                await this.historialRepository.registrarEvento({
                    usuarioId: usuarioId,
                    accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                    entidadAfectada: 'compras',
                    entidadId: id,
                    detalles: {
                        error: "Compra sin items"
                    },
                    solicitudInicialId: solicitudInicialId
                });
                throw new Error("La compra debe tener al menos un item");
            }

            // Validar cada item
            for (const [index, item] of items.entries()) {
                if (!item.nombre || item.nombre.trim() === "") {
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: id,
                        detalles: {
                            error: `Item ${index + 1} sin nombre`
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error(`El item ${index + 1} no tiene nombre`);
                }
                if (item.precio <= 0) {
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: id,
                        detalles: {
                            error: `Precio inválido en item '${item.nombre}'`,
                            precio_provisto: item.precio
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error(`El precio del item '${item.nombre}' debe ser mayor que cero`);
                }
                if (item.cantidad <= 0) {
                    await this.historialRepository.registrarEvento({
                        usuarioId: usuarioId,
                        accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                        entidadAfectada: 'compras',
                        entidadId: id,
                        detalles: {
                            error: `Cantidad inválida en item '${item.nombre}'`,
                            cantidad_provista: item.cantidad
                        },
                        solicitudInicialId: solicitudInicialId
                    });
                    throw new Error(`La cantidad del item '${item.nombre}' debe ser mayor que cero`);
                }
            }

            // Actualizar campos básicos
            compraExistente.setDescripcion(descripcion);
            compraExistente.setCantidadCuotas(cantidadCuotas);

            // Actualizar items
            const itemsActuales = compraExistente.getItems();
            
            // Eliminar items que ya no están
            const itemsAEliminar = itemsActuales.filter(itemActual => 
                !items.some(item => item.id === itemActual.getId())
            );
            
            for (const item of itemsAEliminar) {
                compraExistente.eliminarItem(item.getId());
            }

            // Actualizar/agregar items
            for (const itemData of items) {
                if (itemData.id) {
                    // Actualizar item existente
                    const itemExistente = itemsActuales.find(i => i.getId() === itemData.id);
                    if (itemExistente) {
                        itemExistente.setNombre(itemData.nombre);
                        itemExistente.setPrecio(itemData.precio);
                        itemExistente.setCantidad(itemData.cantidad);
                    }
                } else {
                    // Nuevo item
                    compraExistente.agregarItem(new ItemCompra(0, id, itemData.nombre, itemData.precio, itemData.cantidad));
                }
            }

            // Guardar cambios
            const compraActualizada = await this.repository.updateCompra(compraExistente, compraExistente.getClienteId());

            // Registrar evento de actualización
            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.UPDATE_COMPRA,
                entidadAfectada: 'compras',
                entidadId: id,
                detalles: {
                    cambios: {
                        descripcion: descripcion,
                        cantidad_cuotas: cantidadCuotas,
                        items_modificados: items.length
                    }
                },
                solicitudInicialId: solicitudInicialId
            });

            return compraActualizada;
        } catch (error) {
            // Si no tenemos solicitudInicialId, intentar obtenerlo
            if (solicitudInicialId === undefined) {
                solicitudInicialId = await this.obtenerSolicitudInicialId(id);
            }

            await this.historialRepository.registrarEvento({
                usuarioId: usuarioId,
                accion: HISTORIAL_ACTIONS.ERROR_PROCESO,
                entidadAfectada: 'compras',
                entidadId: id,
                detalles: {
                    error: error instanceof Error ? error.message : String(error),
                    etapa: "actualizacion_compra"
                },
                solicitudInicialId: solicitudInicialId
            });
            
            // Notificar error
            await this.notificationService.emitNotification({
                userId: usuarioId,
                type: "error",
                message: `Error al actualizar compra ${id}: ${error instanceof Error ? error.message : String(error)}`
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
            const solicitudFormalId = await this.repository.getSolicitudFormalIdByCompraId(compraId);
            
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