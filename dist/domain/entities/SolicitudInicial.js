"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudInicial = void 0;
// src/domain/entities/SolicitudInicial.ts
class SolicitudInicial {
    constructor(id, fechaCreacion, estado, dniCliente, clienteId, cuilCliente, reciboSueldo, comercianteId, comentarios = [], analistaAprobadorId, administradorAprobadorId) {
        this.id = id;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.dniCliente = dniCliente;
        this.cuilCliente = cuilCliente;
        this.reciboSueldo = reciboSueldo;
        this.comercianteId = comercianteId;
        this.comentarios = comentarios;
        this.clienteId = clienteId;
        this.analistaAprobadorId = analistaAprobadorId;
        this.administradorAprobadorId = administradorAprobadorId;
    }
    // Getters y Setters
    setAnalistaAprobadorId(id) {
        this.analistaAprobadorId = Number(id);
    }
    setAdministradorAprobadorId(id) {
        this.administradorAprobadorId = Number(id);
    }
    getAnalistaAprobadorId() {
        return this.analistaAprobadorId;
    }
    getAdministradorAprobadorId() {
        return this.administradorAprobadorId;
    }
    getClienteId() {
        return this.clienteId;
    }
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    getId() {
        return this.id;
    }
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    setFechaCreacion(fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    getEstado() {
        return this.estado;
    }
    setEstado(estado) {
        this.estado = estado;
    }
    getDniCliente() {
        return this.dniCliente;
    }
    setDniCliente(dniCliente) {
        this.dniCliente = dniCliente;
    }
    getCuilCliente() {
        return this.cuilCliente;
    }
    setCuilCliente(cuilCliente) {
        this.cuilCliente = cuilCliente;
    }
    getReciboSueldo() {
        return this.reciboSueldo;
    }
    setReciboSueldo(reciboSueldo) {
        this.reciboSueldo = reciboSueldo;
    }
    getComercianteId() {
        return this.comercianteId;
    }
    setComercianteId(comercianteId) {
        this.comercianteId = comercianteId;
    }
    // Métodos para comentarios
    getComentarios() {
        return this.comentarios;
    }
    setComentarios(comentarios) {
        this.comentarios = comentarios;
    }
    agregarComentario(comentario) {
        this.comentarios.push(comentario);
    }
    // Métodos adicionales
    toString() {
        return `SolicitudInicial[id=${this.id}, estado=${this.estado}, dni=${this.dniCliente}, cuil=${this.cuilCliente}]`;
    }
    toPlainObject() {
        return {
            id: this.id,
            fechaCreacion: this.fechaCreacion,
            estado: this.estado,
            dniCliente: this.dniCliente,
            cuilCliente: this.cuilCliente,
            reciboSueldo: this.reciboSueldo,
            comercianteId: this.comercianteId,
            comentarios: this.comentarios,
            analistaAprobadorId: this.analistaAprobadorId,
            administradorAprobadorId: this.administradorAprobadorId,
        };
    }
    static fromMap(map) {
        return new SolicitudInicial(map.id, map.fechaCreacion, map.estado, map.dniCliente, map.clienteId || 0, map.cuilCliente, map.reciboSueldo, map.comercianteId, map.comentarios || [], map.analista_aprobador_id ? Number(map.analista_aprobador_id) : undefined, map.administrador_aprobador_id ? Number(map.administrador_aprobador_id) : undefined);
    }
    validar() {
        return !!this.dniCliente && !!this.cuilCliente;
    }
}
exports.SolicitudInicial = SolicitudInicial;
