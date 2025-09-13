"use strict";
// src/domain/entities/Usuario.ts
/**
 * MÓDULO: Entidad Usuario (Clase Abstracta)
 *
 * Este archivo define la clase abstracta Usuario que representa la entidad base
 * para todos los tipos de usuarios en el sistema de gestión de préstamos.
 *
 * Responsabilidades:
 * - Definir la estructura base de datos para usuarios
 * - Proporcionar métodos comunes para gestión de usuarios
 * - Establecer la interfaz para diferentes tipos de usuarios
 * - Gestionar información personal y de contacto
 * - Manejar autenticación básica de usuarios
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
/**
 * Clase abstracta que representa la entidad base de usuario en el sistema.
 * Define la estructura común para todos los tipos de usuarios (Administrador, Analista, Comerciante).
 * Proporciona métodos para gestión de información personal, autenticación y conversión de datos.
 */
class Usuario {
    /**
     * Constructor de la clase Usuario.
     * Inicializa los datos básicos de un usuario del sistema.
     *
     * @param id - Identificador único del usuario.
     * @param nombre - Nombre del usuario.
     * @param apellido - Apellido del usuario.
     * @param email - Dirección de email del usuario.
     * @param password - Contraseña del usuario (hash).
     * @param telefono - Número de teléfono del usuario.
     */
    constructor(params) {
        this.id = params.id;
        this.nombre = params.nombre;
        this.apellido = params.apellido;
        this.email = params.email;
        this.password = params.password;
        this.telefono = params.telefono;
    }
    /**
     * Obtiene los permisos del usuario.
     * Implementación base que retorna un array vacío.
     * Las subclases pueden sobrescribir este método.
     *
     * @returns Permiso[] - Array de permisos del usuario.
     */
    getPermisos() {
        return [];
    }
    /**
     * Obtiene el ID único del usuario.
     *
     * @returns number - ID del usuario.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene el nombre del usuario.
     *
     * @returns string - Nombre del usuario.
     */
    getNombre() {
        return this.nombre;
    }
    /**
     * Establece el nombre del usuario.
     *
     * @param nombre - Nuevo nombre del usuario.
     */
    setNombre(nombre) {
        this.nombre = nombre;
    }
    /**
     * Obtiene el apellido del usuario.
     *
     * @returns string - Apellido del usuario.
     */
    getApellido() {
        return this.apellido;
    }
    /**
     * Establece el apellido del usuario.
     *
     * @param apellido - Nuevo apellido del usuario.
     */
    setApellido(apellido) {
        this.apellido = apellido;
    }
    /**
     * Obtiene el email del usuario.
     *
     * @returns string - Email del usuario.
     */
    getEmail() {
        return this.email;
    }
    /**
     * Establece el email del usuario.
     *
     * @param email - Nuevo email del usuario.
     */
    setEmail(email) {
        this.email = email;
    }
    /**
     * Obtiene el teléfono del usuario.
     *
     * @returns string - Teléfono del usuario.
     */
    getTelefono() {
        return this.telefono;
    }
    /**
     * Establece el teléfono del usuario.
     *
     * @param telefono - Nuevo teléfono del usuario.
     */
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    /**
     * Obtiene la contraseña del usuario (hash).
     *
     * @returns string - Contraseña hasheada del usuario.
     */
    getPassword() {
        return this.password;
    }
    /**
     * Convierte el usuario a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string del usuario.
     */
    toString() {
        return `Usuario[id=${this.id}, nombre=${this.nombre}, apellido=${this.apellido}, email=${this.email}, telefono=${this.telefono}]`;
    }
    /**
     * Convierte el usuario a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con los datos del usuario.
     */
    toPlainObject() {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            telefono: this.telefono
        };
    }
    /**
     * Crea una instancia de Usuario desde un mapa de datos.
     * Método estático que lanza error ya que no se puede instanciar la clase abstracta directamente.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Usuario - Instancia de Usuario (no se ejecuta).
     * @throws Error - Siempre lanza error indicando que no se puede instanciar directamente.
     */
    static fromMap(map) {
        throw new Error("No se puede instanciar clase abstracta directamente");
    }
    /**
     * Autentica al usuario comparando la contraseña proporcionada.
     * Nota: Esta implementación compara texto plano, en producción debería comparar hashes.
     *
     * @param password - Contraseña a verificar.
     * @returns boolean - true si la contraseña coincide, false en caso contrario.
     */
    autenticar(password) {
        // Implementación real debería comparar hashes, no texto plano
        return this.password === password;
    }
}
exports.Usuario = Usuario;
