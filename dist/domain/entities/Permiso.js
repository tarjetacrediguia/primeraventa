"use strict";
//src/domain/entities/Permiso.ts
/**
 * MÓDULO: Entidad Permiso
 *
 * Este archivo define la clase Permiso que representa un permiso o autorización
 * específica en el sistema de gestión de préstamos.
 *
 * Responsabilidades:
 * - Representar permisos específicos del sistema
 * - Gestionar información de permisos (nombre y descripción)
 * - Proporcionar funcionalidades de autorización
 * - Facilitar el control de acceso basado en roles
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permiso = void 0;
/**
 * Clase que representa un permiso en el sistema.
 * Define las autorizaciones específicas que pueden tener los usuarios
 * para realizar diferentes acciones en el sistema.
 */
class Permiso {
    /**
     * Constructor de la clase Permiso.
     * Inicializa un permiso con su nombre y descripción.
     *
     * @param nombre - Nombre único del permiso.
     * @param descripcion - Descripción detallada del permiso.
     */
    constructor(nombre, descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
    /**
     * Obtiene el nombre del permiso.
     *
     * @returns string - Nombre del permiso.
     */
    getNombre() {
        return this.nombre;
    }
    /**
     * Obtiene la descripción del permiso.
     *
     * @returns string - Descripción del permiso.
     */
    getDescripcion() {
        return this.descripcion;
    }
    /**
     * Establece la descripción del permiso.
     *
     * @param descripcion - Nueva descripción del permiso.
     */
    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }
    /**
     * Convierte el permiso a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string del permiso.
     */
    toString() {
        return `Permiso[nombre=${this.nombre}, descripcion=${this.descripcion}]`;
    }
    /**
     * Convierte el permiso a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con los datos del permiso.
     */
    toPlainObject() {
        return {
            nombre: this.nombre,
            descripcion: this.descripcion
        };
    }
    /**
     * Crea una instancia de Permiso desde un mapa de datos.
     * Método estático para crear permisos desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Permiso - Nueva instancia de Permiso.
     */
    static fromMap(map) {
        return new Permiso(map.nombre, map.descripcion);
    }
}
exports.Permiso = Permiso;
