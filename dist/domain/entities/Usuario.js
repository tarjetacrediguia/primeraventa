"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
// src/domain/entities/Usuario.ts
class Usuario {
    constructor(id, nombre, apellido, email, password, telefono) {
        this.id = id || '';
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
    }
    // Método para obtener permisos (implementación base)
    getPermisos() {
        return [];
    }
    // Getters y Setters
    getId() {
        return this.id;
    }
    getNombre() {
        return this.nombre;
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getApellido() {
        return this.apellido;
    }
    setApellido(apellido) {
        this.apellido = apellido;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getTelefono() {
        return this.telefono;
    }
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getPassword() {
        return this.password;
    }
    // Métodos adicionales
    toString() {
        return `Usuario[id=${this.id}, nombre=${this.nombre}, apellido=${this.apellido}, email=${this.email}, telefono=${this.telefono}]`;
    }
    toPlainObject() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            telefono: this.telefono
        };
    }
    static fromMap(map) {
        throw new Error("No se puede instanciar clase abstracta directamente");
    }
    autenticar(password) {
        // Implementación real debería comparar hashes, no texto plano
        return this.password === password;
    }
}
exports.Usuario = Usuario;
