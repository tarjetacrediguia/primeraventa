"use strict";
//src/domain/entities/Permiso.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permiso = void 0;
class Permiso {
    constructor(nombre, descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
    // Getters y Setters
    getNombre() {
        return this.nombre;
    }
    getDescripcion() {
        return this.descripcion;
    }
    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }
    // Métodos adicionales
    toString() {
        return `Permiso[nombre=${this.nombre}, descripcion=${this.descripcion}]`;
    }
    toPlainObject() {
        return {
            nombre: this.nombre,
            descripcion: this.descripcion
        };
    }
    static fromMap(map) {
        return new Permiso(map.nombre, map.descripcion);
    }
}
exports.Permiso = Permiso;
