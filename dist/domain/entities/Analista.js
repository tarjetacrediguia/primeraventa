"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analista = void 0;
const Usuario_1 = require("./Usuario");
class Analista extends Usuario_1.Usuario {
    constructor(id, nombre, apellido, email, password, telefono, permisos) {
        super(id, nombre, apellido, email, password, telefono);
        this.permisos = permisos;
    }
    // Getters y Setters
    getPermisos() {
        return this.permisos;
    }
    setPermisos(permisos) {
        this.permisos = permisos;
    }
    // Métodos adicionales
    toString() {
        return `${super.toString()}, permisos=${this.permisos.join(',')}`;
    }
    toPlainObject() {
        return Object.assign(Object.assign({}, super.toPlainObject()), { permisos: this.permisos });
    }
    static fromMap(map) {
        return new Analista(map.id, map.nombre, map.apellido, map.email, map.password, map.telefono, map.permisos);
    }
    autenticar(password) {
        return super.autenticar(password);
    }
    getRol() {
        return 'analista';
    }
}
exports.Analista = Analista;
