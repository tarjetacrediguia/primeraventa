"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudInicial = void 0;
// src/domain/entities/SolicitudInicial.ts
class SolicitudInicial {
    constructor(id, fechaCreacion, estado, dniCliente, cuilCliente, reciboSueldo, comercianteId, comentarios = [] // Nuevo parámetro
    ) {
        this.id = id;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.dniCliente = dniCliente;
        this.cuilCliente = cuilCliente;
        this.reciboSueldo = reciboSueldo;
        this.comercianteId = comercianteId;
        this.comentarios = comentarios;
    }
    // Getters y Setters
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
            comentarios: this.comentarios // Nuevo campo
        };
    }
    static fromMap(map) {
        return new SolicitudInicial(map.id, map.fechaCreacion, map.estado, map.dniCliente, map.cuilCliente, map.reciboSueldo, map.comercianteId, map.comentarios || [] // Nuevo campo
        );
    }
    validar() {
        return !!this.dniCliente && !!this.cuilCliente;
    }
}
exports.SolicitudInicial = SolicitudInicial;
