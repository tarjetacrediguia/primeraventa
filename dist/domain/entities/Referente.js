"use strict";
// src/domain/entities/Referente.ts
/**
 * MÓDULO: Entidad Referente
 *
 * Este archivo define la clase Referente que representa a una persona de referencia
 * para un solicitante de préstamo en el sistema.
 *
 * Responsabilidades:
 * - Representar personas de referencia para solicitantes
 * - Gestionar información de contacto de referentes
 * - Proporcionar datos de validación para solicitudes
 * - Facilitar la verificación de información del solicitante
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Referente = void 0;
/**
 * Clase que representa una persona de referencia para un solicitante de préstamo.
 * Contiene información personal y de contacto del referente, así como
 * el vínculo que mantiene con el solicitante.
 */
class Referente {
    /**
     * Constructor de la clase Referente.
     * Inicializa un referente con sus datos personales y de contacto.
     *
     * @param nombreCompleto - Nombre completo del referente.
     * @param apellido - Apellido del referente.
     * @param vinculo - Vínculo o relación con el solicitante.
     * @param telefono - Número de teléfono del referente.
     */
    constructor(nombreCompleto, apellido, vinculo, telefono) {
        this.nombreCompleto = nombreCompleto;
        this.apellido = apellido;
        this.vinculo = vinculo;
        this.telefono = telefono;
    }
    /**
     * Obtiene el nombre completo del referente.
     *
     * @returns string - Nombre completo del referente.
     */
    getNombreCompleto() {
        return this.nombreCompleto;
    }
    /**
     * Establece el nombre completo del referente.
     *
     * @param nombreCompleto - Nuevo nombre completo del referente.
     */
    setNombreCompleto(nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    /**
     * Obtiene el apellido del referente.
     *
     * @returns string - Apellido del referente.
     */
    getApellido() {
        return this.apellido;
    }
    /**
     * Establece el apellido del referente.
     *
     * @param apellido - Nuevo apellido del referente.
     */
    setApellido(apellido) {
        this.apellido = apellido;
    }
    /**
     * Obtiene el vínculo del referente con el solicitante.
     *
     * @returns string - Vínculo o relación con el solicitante.
     */
    getVinculo() {
        return this.vinculo;
    }
    /**
     * Establece el vínculo del referente con el solicitante.
     *
     * @param vinculo - Nuevo vínculo o relación con el solicitante.
     */
    setVinculo(vinculo) {
        this.vinculo = vinculo;
    }
    /**
     * Obtiene el teléfono del referente.
     *
     * @returns string - Número de teléfono del referente.
     */
    getTelefono() {
        return this.telefono;
    }
    /**
     * Establece el teléfono del referente.
     *
     * @param telefono - Nuevo número de teléfono del referente.
     */
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    /**
     * Obtiene el ID único del referente.
     *
     * @returns number | undefined - ID del referente o undefined si no tiene.
     */
    getId() {
        return this.id;
    }
    /**
     * Establece el ID único del referente.
     *
     * @param id - Nuevo ID del referente.
     */
    setId(id) {
        this.id = id;
    }
    /**
     * Convierte el referente a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string del referente.
     */
    toString() {
        return `Referente[nombre=${this.nombreCompleto} ${this.apellido}, vinculo=${this.vinculo}, tel=${this.telefono}]`;
    }
    /**
     * Convierte el referente a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos del referente.
     */
    toPlainObject() {
        return {
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            vinculo: this.vinculo,
            telefono: this.telefono
        };
    }
    /**
     * Crea una instancia de Referente desde un mapa de datos.
     * Método estático para crear referentes desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Referente - Nueva instancia de Referente.
     */
    static fromMap(map) {
        return new Referente(map.nombreCompleto, map.apellido, map.vinculo, map.telefono);
    }
}
exports.Referente = Referente;
