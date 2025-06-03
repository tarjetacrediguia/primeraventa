"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comerciante = void 0;
// src/domain/entities/Comerciante.ts
const Usuario_1 = require("./Usuario");
class Comerciante extends Usuario_1.Usuario {
    constructor(id, nombre, apellido, email, password, telefono, nombreComercio, cuil, direccionComercio, permisos) {
        super(id, nombre, apellido, email, password, telefono);
        this.nombreComercio = nombreComercio;
        this.cuil = cuil;
        this.direccionComercio = direccionComercio;
        this.permisos = permisos;
    }
    // Getters y Setters
    getNombreComercio() {
        return this.nombreComercio;
    }
    setNombreComercio(nombreComercio) {
        this.nombreComercio = nombreComercio;
    }
    getCuil() {
        return this.cuil;
    }
    setCuil(cuil) {
        this.cuil = cuil;
    }
    getDireccionComercio() {
        return this.direccionComercio;
    }
    setDireccionComercio(direccionComercio) {
        this.direccionComercio = direccionComercio;
    }
    getPermisos() {
        return this.permisos;
    }
    setPermisos(permisos) {
        this.permisos = permisos;
    }
    // Métodos adicionales
    toString() {
        return `${super.toString()}, comercio=${this.nombreComercio}, CUIL=${this.cuil}, direccion=${this.direccionComercio}`;
    }
    toPlainObject() {
        return Object.assign(Object.assign({}, super.toPlainObject()), { nombreComercio: this.nombreComercio, cuil: this.cuil, direccionComercio: this.direccionComercio });
    }
    static fromMap(map) {
        return new Comerciante(map.id, map.nombre, map.apellido, map.email, map.password, map.telefono, map.nombreComercio, map.cuil, map.direccionComercio, map.permisos);
    }
    autenticar(password) {
        return super.autenticar(password);
    }
}
exports.Comerciante = Comerciante;
