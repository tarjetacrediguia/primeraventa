// src/domain/entities/Compra.ts

//import { ItemCompra } from "./ItemCompra";

export interface CompraParams {
    id: number;
    solicitudFormalId: number;
    descripcion: string;
    cantidadCuotas: number;
    //items?: ItemCompra[];
    estado?: EstadoCompra;
    montoTotal: number;
    clienteId: number;
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
    valorCuota?: number;
    numeroAutorizacion?: string;
    numeroCuenta?: string;
    comercianteId?: number;
    analistaAprobadorId?: number;
    motivoRechazo?: string;
}

export enum EstadoCompra {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada'
}

/**
 * MÓDULO: Entidad Compra
 * Representa una compra asociada a una solicitud formal.
 * 
 * Responsabilidades:
 * - Representar compras realizadas por clientes
 * - Gestionar items de compra con sus precios
 * - Calcular montos totales automáticamente
 * - Mantener relación con solicitudes formales
 * 
 * @author Sistema de Gestión
 * @version 1.0.0
 */


export class Compra {
    private readonly id: number;
    private solicitudFormalId: number;
    private montoTotal: number;
    private descripcion: string;
    private cantidadCuotas: number;
    private fechaCreacion: Date;
    private fechaActualizacion: Date;
    //private items: ItemCompra[];
    private estado: EstadoCompra;
    private valorCuota: number;
    private clienteId: number; // ID del cliente asociado a la compra
    private numeroAutorizacion?: string;
    private numeroCuenta?: string;
    private comercianteId?: number;
    private analistaAprobadorId?: number;
    private motivoRechazo?: string;
 

    /**
     * Constructor de la clase Compra
     * @param id Identificador único
     * @param solicitudFormalId ID de la solicitud formal asociada
     * @param descripcion Descripción general de la compra
     * @param cantidadCuotas Cantidad de cuotas elegidas
     * @param items Lista de items de compra
     * @param montoTotal Monto total calculado automáticamente
     * @param fechaCreacion Fecha de creación
     * @param fechaActualizacion Fecha de última actualización
     */
    constructor(params: CompraParams) {
        this.id = params.id;
        this.solicitudFormalId = params.solicitudFormalId;
        this.descripcion = params.descripcion;
        this.cantidadCuotas = params.cantidadCuotas;
        //this.items = params.items || [];
        this.montoTotal = params.montoTotal //|| this.calcularMontoTotal();
        this.fechaCreacion = params.fechaCreacion || new Date();
        this.fechaActualizacion = params.fechaActualizacion || new Date();
        this.estado = params.estado || EstadoCompra.PENDIENTE;
        this.valorCuota = params.valorCuota || (this.cantidadCuotas > 0 ? (this.montoTotal) / this.cantidadCuotas : 0);
        this.clienteId = params.clienteId;
        this.numeroAutorizacion = params.numeroAutorizacion;
        this.numeroCuenta = params.numeroCuenta;
        this.comercianteId = params.comercianteId;
        this.analistaAprobadorId = params.analistaAprobadorId;
        this.motivoRechazo = params.motivoRechazo;
    }

    // Getter y Setter para motivoRechazo
    public getMotivoRechazo(): string | undefined {
        return this.motivoRechazo;
    }

    public setMotivoRechazo(motivo: string | undefined): void {
        this.motivoRechazo = motivo;
    }


    public setMontoTotal(montoTotal: number): void {
        this.montoTotal = montoTotal;
        this.valorCuota = this.cantidadCuotas > 0 ? montoTotal / this.cantidadCuotas : 0;
        this.actualizarFechaActualizacion();
    }
    

    // Getters
    public getClienteId(): number {
        return this.clienteId;
    }
    public getId(): number {
        return this.id;
    }

    public getSolicitudFormalId(): number {
        return this.solicitudFormalId;
    }

    public getMontoTotal(): number {
        return this.montoTotal;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getCantidadCuotas(): number {
        return this.cantidadCuotas;
    }

    public getFechaCreacion(): Date {
        return this.fechaCreacion;  
    }

    public getFechaActualizacion(): Date {
        return this.fechaActualizacion;
    }
/*
    public getItems(): ItemCompra[] {
        return this.items;
    }
*/
     public getEstado(): EstadoCompra {
    return this.estado;
  }

  public setEstado(estado: EstadoCompra): void {
    this.estado = estado;
  }

    public getValorCuota(): number {
        return this.valorCuota;
    }

    public getNumeroAutorizacion(): string | undefined {
        return this.numeroAutorizacion;
    }

    public setNumeroAutorizacion(numeroAutorizacion: string | undefined): void {
        this.numeroAutorizacion = numeroAutorizacion;
    }

    public getNumeroCuenta(): string | undefined {
        return this.numeroCuenta;
    }

    public setNumeroCuenta(numeroCuenta: string | undefined): void {
        this.numeroCuenta = numeroCuenta;
    }
    public getComercianteId(): number | undefined {
        return this.comercianteId;
    }

    public setComercianteId(comercianteId: number | undefined): void {
        this.comercianteId = comercianteId;
    }

    public getAnalistaAprobadorId(): number | undefined {
        return this.analistaAprobadorId;
    }

    public setAnalistaAprobadorId(analistaAprobadorId: number | undefined): void {
        this.analistaAprobadorId = analistaAprobadorId;
    }
    // Setters
    public setClienteId(clienteId: number): void {
        this.clienteId = clienteId;
    }
    public setValorCuota(valorCuota: number): void {
        this.valorCuota = valorCuota;
    }
    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public setCantidadCuotas(cantidadCuotas: number): void {
        this.cantidadCuotas = cantidadCuotas;
    }
/*
    // Métodos de gestión de items
    public agregarItem(item: ItemCompra): void {
        this.items.push(item);
        this.montoTotal = this.calcularMontoTotal();
    }

    public eliminarItem(itemId: number): void {
        this.items = this.items.filter(item => item.getId() !== itemId);
        this.montoTotal = this.calcularMontoTotal();
    }

    public actualizarItem(itemId: number, nuevoItem: ItemCompra): void {
        const index = this.items.findIndex(item => item.getId() === itemId);
        if (index !== -1) {
            this.items[index] = nuevoItem;
            this.montoTotal = this.calcularMontoTotal();
        }
    }
        

    // Cálculos internos
    private calcularMontoTotal(): number {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }
*/
    private actualizarFechaActualizacion(): void {
        this.fechaActualizacion = new Date();
    }

    public setFechaActualizacion(fecha: Date): void {
        this.fechaActualizacion = fecha;
    }

    // Serialización
    public toPlainObject(): any {
        return {
            id: this.id,
            solicitudFormalId: this.solicitudFormalId,
            montoTotal: this.montoTotal,
            descripcion: this.descripcion,
            cantidadCuotas: this.cantidadCuotas,
            fechaCreacion: this.fechaCreacion,
            fechaActualizacion: this.fechaActualizacion,
            //items: this.items.map(item => item.toPlainObject()),
            estado: this.estado,
            valorCuota: this.valorCuota,
            numeroAutorizacion: this.numeroAutorizacion,
            numeroCuenta: this.numeroCuenta,
            clienteId: this.clienteId,
            comercianteId: this.comercianteId,
            analistaAprobadorId: this.analistaAprobadorId,
            motivoRechazo: this.motivoRechazo
        };
    }

    public static fromMap(map: any): Compra {
        return new Compra({
            id: map.id,
            solicitudFormalId: map.solicitudFormalId,
            descripcion: map.descripcion,
            cantidadCuotas: map.cantidadCuotas,
            //items: map.items ? map.items.map((i: any) => ItemCompra.fromMap(i)) : [],
            estado: map.estado || EstadoCompra.PENDIENTE,
            montoTotal: map.montoTotal,
            clienteId: map.clienteId,
            fechaCreacion: map.fechaCreacion ? new Date(map.fechaCreacion) : undefined,
            fechaActualizacion: map.fechaActualizacion ? new Date(map.fechaActualizacion) : undefined,
            valorCuota: map.valorCuota || (map.cantidadCuotas > 0 ? map.montoTotal / map.cantidadCuotas : 0),
            numeroAutorizacion: map.numeroAutorizacion,
            numeroCuenta: map.numeroCuenta,
            comercianteId: map.comercianteId,
            analistaAprobadorId: map.analistaAprobadorId
        });
    }
}