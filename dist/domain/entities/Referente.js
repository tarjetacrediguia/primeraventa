"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referente = void 0;
// src/domain/entities/Referente.ts
class Referente {
    constructor(nombreCompleto, apellido, vinculo, telefono) {
        this.nombreCompleto = nombreCompleto;
        this.apellido = apellido;
        this.vinculo = vinculo;
        this.telefono = telefono;
    }
    // Getters y Setters
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
    getVinculo() {
        return this.vinculo;
    }
    setVinculo(vinculo) {
        this.vinculo = vinculo;
    }
    getTelefono() {
        return this.telefono;
    }
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    // Métodos adicionales
    toString() {
        return `Referente[nombre=${this.nombreCompleto} ${this.apellido}, vinculo=${this.vinculo}, tel=${this.telefono}]`;
    }
    toPlainObject() {
        return {
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            vinculo: this.vinculo,
            telefono: this.telefono
        };
    }
    static fromMap(map) {
        return new Referente(map.nombreCompleto, map.apellido, map.vinculo, map.telefono);
    }
}
exports.Referente = Referente;
