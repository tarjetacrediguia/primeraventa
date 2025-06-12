"use strict";
//src/domain/entities/Permiso.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permiso = void 0;
class Permiso {
    constructor(nombre, descripcion, categoria, fechaCreacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.fechaCreacion = fechaCreacion;
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
    getCategoria() {
        return this.categoria;
    }
    setCategoria(categoria) {
        this.categoria = categoria;
    }
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    // Métodos adicionales
    toString() {
        return `Permiso[nombre=${this.nombre}, categoria=${this.categoria}]`;
    }
    toPlainObject() {
        return {
            nombre: this.nombre,
            descripcion: this.descripcion,
            categoria: this.categoria,
            fechaCreacion: this.fechaCreacion
        };
    }
    static fromMap(map) {
        return new Permiso(map.nombre, map.descripcion, map.categoria, map.fecha_creacion);
    }
}
exports.Permiso = Permiso;
