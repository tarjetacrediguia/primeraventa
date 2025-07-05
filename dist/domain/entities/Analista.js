"use strict";
/**
 * MÓDULO: Entidad Analista
 *
 * Este archivo define la clase Analista que representa a un usuario analista
 * en el sistema de gestión de préstamos, con permisos para análisis y evaluación.
 *
 * Responsabilidades:
 * - Representar usuarios con rol de analista
 * - Gestionar permisos específicos de análisis
 * - Proporcionar funcionalidades de evaluación de solicitudes
 * - Extender la funcionalidad base de Usuario
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analista = void 0;
const Usuario_1 = require("./Usuario");
/**
 * Clase que representa un usuario analista en el sistema.
 * Extiende la clase Usuario y agrega funcionalidades específicas para analistas,
 * incluyendo gestión de permisos de análisis y evaluación.
 */
class Analista extends Usuario_1.Usuario {
    /**
     * Constructor de la clase Analista.
     * Inicializa un analista con sus datos básicos y permisos específicos.
     *
     * @param id - Identificador único del analista.
     * @param nombre - Nombre del analista.
     * @param apellido - Apellido del analista.
     * @param email - Dirección de email del analista.
     * @param password - Contraseña del analista (hash).
     * @param telefono - Número de teléfono del analista.
     * @param permisos - Array de permisos del analista (opcional).
     */
    constructor(id, nombre, apellido, email, password, telefono, permisos) {
        super(id, nombre, apellido, email, password, telefono);
        this.permisos = permisos !== null && permisos !== void 0 ? permisos : [];
    }
    /**
     * Obtiene los permisos específicos del analista.
     *
     * @returns Permiso[] - Array de permisos del analista.
     */
    getPermisos() {
        return this.permisos;
    }
    /**
     * Establece los permisos del analista.
     *
     * @param permisos - Nuevo array de permisos para el analista.
     */
    setPermisos(permisos) {
        this.permisos = permisos;
    }
    /**
     * Convierte el analista a una representación de string.
     * Incluye la información base del usuario más los permisos.
     *
     * @returns string - Representación en string del analista.
     */
    toString() {
        return `${super.toString()}, permisos=${this.permisos.join(',')}`;
    }
    /**
     * Convierte el analista a un objeto plano.
     * Incluye todos los datos del usuario base más los permisos específicos.
     *
     * @returns any - Objeto plano con los datos del analista.
     */
    toPlainObject() {
        return Object.assign(Object.assign({}, super.toPlainObject()), { permisos: this.permisos });
    }
    /**
     * Crea una instancia de Analista desde un mapa de datos.
     * Método estático para crear analistas desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Analista - Nueva instancia de Analista.
     */
    static fromMap(map) {
        return new Analista(map.id, map.nombre, map.apellido, map.email, map.password, map.telefono, map.permisos);
    }
    /**
     * Autentica al analista comparando la contraseña proporcionada.
     * Utiliza el método de autenticación de la clase padre.
     *
     * @param password - Contraseña a verificar.
     * @returns boolean - true si la contraseña coincide, false en caso contrario.
     */
    autenticar(password) {
        return super.autenticar(password);
    }
    /**
     * Obtiene el rol específico del analista.
     * Implementación del método abstracto de la clase padre.
     *
     * @returns string - Rol del analista ('analista').
     */
    getRol() {
        return 'analista';
    }
}
exports.Analista = Analista;
