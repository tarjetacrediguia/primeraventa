"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrato = void 0;
// src/domain/entities/Contrato.ts
class Contrato {
    constructor(id, fechaGeneracion, monto, estado, solicitudFormalId, clienteId, numeroTarjeta, numeroCuenta) {
        this.id = id;
        this.fechaGeneracion = fechaGeneracion;
        this.monto = monto;
        this.estado = estado;
        this.solicitudFormalId = solicitudFormalId;
        this.clienteId = clienteId;
        this.numeroTarjeta = numeroTarjeta;
        this.numeroCuenta = numeroCuenta;
    }
    // Getters y Setters
    getPdfContrato() {
        return this.pdfContrato;
    }
    setPdfContrato(pdf) {
        this.pdfContrato = pdf;
    }
    getId() {
        return this.id;
    }
    getFechaGeneracion() {
        return this.fechaGeneracion;
    }
    setFechaGeneracion(fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }
    getMonto() {
        return this.monto;
    }
    setMonto(monto) {
        this.monto = monto;
    }
    getEstado() {
        return this.estado;
    }
    setEstado(estado) {
        this.estado = estado;
    }
    getSolicitudFormalId() {
        return this.solicitudFormalId;
    }
    setSolicitudFormalId(solicitudFormalId) {
        this.solicitudFormalId = solicitudFormalId;
    }
    getClienteId() {
        return this.clienteId;
    }
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    getNumeroTarjeta() {
        return this.numeroTarjeta;
    }
    setNumeroTarjeta(numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    getNumeroCuenta() {
        return this.numeroCuenta;
    }
    setNumeroCuenta(numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    // Métodos adicionales
    toString() {
        return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, monto=${this.monto}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroTarjeta=${this.numeroTarjeta || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
    }
    toPlainObject() {
        return {
            id: this.id,
            fechaGeneracion: this.fechaGeneracion,
            monto: this.monto,
            estado: this.estado,
            solicitudFormalId: this.solicitudFormalId,
            clienteId: this.clienteId,
            numeroTarjeta: this.numeroTarjeta,
            numeroCuenta: this.numeroCuenta
        };
    }
    static fromMap(map) {
        return new Contrato(map.id, map.fechaGeneracion, map.monto, map.estado, map.solicitudFormalId, map.clienteId, map.numeroTarjeta, map.numeroCuenta);
    }
    generarPDF() {
        throw new Error("Method not implemented.");
    }
}
exports.Contrato = Contrato;
