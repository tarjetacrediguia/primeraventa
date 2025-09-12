// src/application/ports/CompraRepositoryPort.ts
import { Compra, EstadoCompra } from "../../domain/entities/Compra";

/**
 * Puerto para operaciones de repositorio de compras.
 */
export interface CompraRepositoryPort {
    saveCompra(compra: Compra, clienteId: number): Promise<Compra>;
    getCompraById(id: number): Promise<any | null>;
    updateCompra(compra: Compra, clienteId: number): Promise<Compra>;
    deleteCompra(id: number): Promise<void>;
    getComprasBySolicitudFormalId(solicitudFormalId: number): Promise<any>;
    getComprasByEstado(estado: EstadoCompra): Promise<any[]>;
    getSolicitudFormalIdByCompraId(compraId: number): Promise<number | null>;
    getComprasByComerciante(comercianteId: number): Promise<any[]>;
    getAllCompras(): Promise<any[]>;
}