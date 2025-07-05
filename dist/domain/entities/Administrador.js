"use strict";
// src/domain/entities/Administrador.ts
/**
 * MÓDULO: Entidad Administrador
 *
 * Este archivo define la clase Administrador que representa a un usuario administrador
 * en el sistema de gestión de préstamos, con permisos especiales de gestión.
 *
 * Responsabilidades:
 * - Representar usuarios con rol de administrador
 * - Gestionar permisos específicos de administración
 * - Proporcionar funcionalidades de gestión del sistema
 * - Extender la funcionalidad base de Usuario
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Administrador = void 0;
const Usuario_1 = require("./Usuario");
/**
 * Clase que representa un usuario administrador en el sistema.
 * Extiende la clase Usuario y agrega funcionalidades específicas para administradores,
 * incluyendo gestión de permisos especiales.
 */
class Administrador extends Usuario_1.Usuario {
    /**
     * Constructor de la clase Administrador.
     * Inicializa un administrador con sus datos básicos y permisos específicos.
     *
     * @param id - Identificador único del administrador.
     * @param nombre - Nombre del administrador.
     * @param apellido - Apellido del administrador.
     * @param email - Dirección de email del administrador.
     * @param password - Contraseña del administrador (hash).
     * @param telefono - Número de teléfono del administrador.
     * @param permisos - Array de permisos del administrador (opcional).
     */
    constructor(id, nombre, apellido, email, password, telefono, permisos) {
        super(id, nombre, apellido, email, password, telefono);
        this.permisos = permisos !== null && permisos !== void 0 ? permisos : [];
    }
    /**
     * Obtiene los permisos específicos del administrador.
     *
     * @returns Permiso[] - Array de permisos del administrador.
     */
    getPermisos() {
        return this.permisos;
    }
    /**
     * Establece los permisos del administrador.
     *
     * @param permisos - Nuevo array de permisos para el administrador.
     */
    setPermisos(permisos) {
        this.permisos = permisos;
    }
    /**
     * Convierte el administrador a una representación de string.
     * Incluye la información base del usuario más los permisos.
     *
     * @returns string - Representación en string del administrador.
     */
    toString() {
        return `${super.toString()}, permisos=${this.permisos.join(',')}`;
    }
    /**
     * Convierte el administrador a un objeto plano.
     * Incluye todos los datos del usuario base más los permisos específicos.
     *
     * @returns any - Objeto plano con los datos del administrador.
     */
    toPlainObject() {
        return Object.assign(Object.assign({}, super.toPlainObject()), { permisos: this.permisos });
    }
    /**
     * Crea una instancia de Administrador desde un mapa de datos.
     * Método estático para crear administradores desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Administrador - Nueva instancia de Administrador.
     */
    static fromMap(map) {
        return new Administrador(map.id, map.nombre, map.apellido, map.email, map.password, map.telefono, map.permisos);
    }
    /**
     * Autentica al administrador comparando la contraseña proporcionada.
     * Utiliza el método de autenticación de la clase padre.
     *
     * @param password - Contraseña a verificar.
     * @returns boolean - true si la contraseña coincide, false en caso contrario.
     */
    autenticar(password) {
        return super.autenticar(password);
    }
    /**
     * Obtiene el rol específico del administrador.
     * Implementación del método abstracto de la clase padre.
     *
     * @returns string - Rol del administrador ('administrador').
     */
    getRol() {
        return 'administrador';
    }
}
exports.Administrador = Administrador;
