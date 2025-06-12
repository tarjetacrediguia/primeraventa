"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudFormal = void 0;
// src/domain/entities/SolicitudFormal.ts
const Referente_1 = require("./Referente");
class SolicitudFormal {
    constructor(id, solicitudInicialId, comercianteId, nombreCompleto, apellido, dni, telefono, email, fechaSolicitud, recibo, estado, aceptaTarjeta, fechaNacimiento, domicilio, datosEmpleador, referentes, comentarios = [], clienteId = 0, numeroTarjeta, numeroCuenta, fechaAprobacion) {
        this.id = id;
        this.solicitudInicialId = solicitudInicialId;
        this.comercianteId = comercianteId;
        this.nombreCompleto = nombreCompleto;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.fechaSolicitud = fechaSolicitud;
        this.recibo = recibo;
        this.estado = estado;
        this.aceptaTarjeta = aceptaTarjeta;
        this.fechaNacimiento = fechaNacimiento;
        this.domicilio = domicilio;
        this.datosEmpleador = datosEmpleador;
        this.referentes = referentes || [];
        this.comentarios = comentarios;
        this.clienteId = clienteId;
        this.numeroTarjeta = numeroTarjeta;
        this.numeroCuenta = numeroCuenta;
        this.fechaAprobacion = fechaAprobacion;
    }
    // Getters y Setters
    getFechaAprobacion() {
        return this.fechaAprobacion;
    }
    setFechaAprobacion(fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }
    getNumeroCuenta() {
        return this.numeroCuenta;
    }
    setNumeroCuenta(numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    getNumeroTarjeta() {
        return this.numeroTarjeta;
    }
    setNumeroTarjeta(numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    getClienteId() {
        return this.clienteId;
    }
    getSolicitudInicialId() {
        return this.solicitudInicialId;
    }
    getComercianteId() {
        return this.comercianteId;
    }
    getId() {
        return this.id;
    }
    getNombreCompleto() {
        return this.nombreCompleto;
    }
    setNombreCompleto(nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    getApellido() {
        return this.apellido;
    }
    setApellido(apellido) {
        this.apellido = apellido;
    }
    getDni() {
        return this.dni;
    }
    setDni(dni) {
        this.dni = dni;
    }
    getTelefono() {
        return this.telefono;
    }
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getFechaSolicitud() {
        return this.fechaSolicitud;
    }
    setFechaSolicitud(fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }
    getRecibo() {
        return this.recibo;
    }
    setRecibo(recibo) {
        this.recibo = recibo;
    }
    getEstado() {
        return this.estado;
    }
    setEstado(estado) {
        this.estado = estado;
    }
    getAceptaTarjeta() {
        return this.aceptaTarjeta;
    }
    setAceptaTarjeta(aceptaTarjeta) {
        this.aceptaTarjeta = aceptaTarjeta;
    }
    getFechaNacimiento() {
        return this.fechaNacimiento;
    }
    setFechaNacimiento(fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    getDomicilio() {
        return this.domicilio;
    }
    setDomicilio(domicilio) {
        this.domicilio = domicilio;
    }
    getDatosEmpleador() {
        return this.datosEmpleador;
    }
    setDatosEmpleador(datosEmpleador) {
        this.datosEmpleador = datosEmpleador;
    }
    getReferentes() {
        return this.referentes;
    }
    setReferentes(referentes) {
        this.referentes = referentes;
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
        return `SolicitudFormal[id=${this.id}, estado=${this.estado}, solicitante=${this.nombreCompleto} ${this.apellido}]`;
    }
    toPlainObject() {
        return {
            id: this.id,
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            dni: this.dni,
            telefono: this.telefono,
            email: this.email,
            fechaSolicitud: this.fechaSolicitud,
            recibo: this.recibo,
            estado: this.estado,
            aceptaTarjeta: this.aceptaTarjeta,
            fechaNacimiento: this.fechaNacimiento,
            domicilio: this.domicilio,
            datosEmpleador: this.datosEmpleador,
            referentes: this.referentes.map(r => r.toPlainObject()),
            comentarios: this.comentarios,
            numeroTarjeta: this.numeroTarjeta,
            numeroCuenta: this.numeroCuenta
        };
    }
    static fromMap(map) {
        return new SolicitudFormal(map.id, map.solicitudInicialId, map.comercianteId, map.nombreCompleto, map.apellido, map.dni, map.telefono, map.email, map.fechaSolicitud, map.recibo, map.estado, map.aceptaTarjeta, map.fechaNacimiento, map.domicilio, map.datosEmpleador, map.referentes.map((r) => Referente_1.Referente.fromMap(r)), map.comentarios || [], map.clienteId || 0, map.numeroTarjeta, map.numeroCuenta, map.fechaAprobacion);
    }
}
exports.SolicitudFormal = SolicitudFormal;
