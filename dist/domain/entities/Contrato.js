"use strict";
// src/domain/entities/Contrato.ts
/**
 * MÓDULO: Entidad Contrato
 *
 * Este archivo define la clase Contrato que representa un contrato de préstamo
 * generado en el sistema de gestión de préstamos.
 *
 * Responsabilidades:
 * - Representar contratos de préstamo generados
 * - Gestionar información del contrato (monto, estado, fechas)
 * - Manejar documentos PDF del contrato
 * - Proporcionar funcionalidades de generación de contratos
 * - Gestionar números de cuenta y tarjeta asociados
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrato = void 0;
/**
 * Clase que representa un contrato de préstamo en el sistema.
 * Contiene toda la información relacionada con el contrato, incluyendo
 * monto, estado, fechas y documentos asociados.
 */
class Contrato {
    /**
     * Constructor de la clase Contrato.
     * Inicializa un contrato con todos sus datos básicos.
     *
     * @param id - Identificador único del contrato.
     * @param fechaGeneracion - Fecha de generación del contrato.
     * @param monto - Monto del préstamo.
     * @param estado - Estado actual del contrato.
     * @param solicitudFormalId - ID de la solicitud formal asociada.
     * @param clienteId - ID del cliente beneficiario.
     * @param numeroTarjeta - Número de tarjeta asignado (opcional).
     * @param numeroCuenta - Número de cuenta asignado (opcional).
     */
    constructor(id, fechaGeneracion, monto, estado, solicitudFormalId, clienteId, numeroTarjeta, numeroCuenta) {
        this.id = id;
        this.fechaGeneracion = fechaGeneracion;
        this.monto = monto;
        this.estado = estado;
        this.solicitudFormalId = solicitudFormalId;
        this.clienteId = clienteId;
        this.numeroTarjeta = numeroTarjeta;
        this.numeroCuenta = numeroCuenta;
    }
    /**
     * Obtiene el PDF del contrato.
     *
     * @returns Buffer | undefined - PDF del contrato o undefined si no existe.
     */
    getPdfContrato() {
        return this.pdfContrato;
    }
    /**
     * Establece el PDF del contrato.
     *
     * @param pdf - Nuevo PDF del contrato.
     */
    setPdfContrato(pdf) {
        this.pdfContrato = pdf;
    }
    /**
     * Obtiene el ID único del contrato.
     *
     * @returns number - ID del contrato.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene la fecha de generación del contrato.
     *
     * @returns Date - Fecha de generación del contrato.
     */
    getFechaGeneracion() {
        return this.fechaGeneracion;
    }
    /**
     * Establece la fecha de generación del contrato.
     *
     * @param fechaGeneracion - Nueva fecha de generación del contrato.
     */
    setFechaGeneracion(fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }
    /**
     * Obtiene el monto del préstamo.
     *
     * @returns number - Monto del préstamo.
     */
    getMonto() {
        return this.monto;
    }
    /**
     * Establece el monto del préstamo.
     *
     * @param monto - Nuevo monto del préstamo.
     */
    setMonto(monto) {
        this.monto = monto;
    }
    /**
     * Obtiene el estado actual del contrato.
     *
     * @returns string - Estado del contrato.
     */
    getEstado() {
        return this.estado;
    }
    /**
     * Establece el estado del contrato.
     *
     * @param estado - Nuevo estado del contrato.
     */
    setEstado(estado) {
        this.estado = estado;
    }
    /**
     * Obtiene el ID de la solicitud formal asociada.
     *
     * @returns number - ID de la solicitud formal.
     */
    getSolicitudFormalId() {
        return this.solicitudFormalId;
    }
    /**
     * Establece el ID de la solicitud formal asociada.
     *
     * @param solicitudFormalId - Nuevo ID de la solicitud formal.
     */
    setSolicitudFormalId(solicitudFormalId) {
        this.solicitudFormalId = solicitudFormalId;
    }
    /**
     * Obtiene el ID del cliente beneficiario.
     *
     * @returns number - ID del cliente.
     */
    getClienteId() {
        return this.clienteId;
    }
    /**
     * Establece el ID del cliente beneficiario.
     *
     * @param clienteId - Nuevo ID del cliente.
     */
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    /**
     * Obtiene el número de tarjeta asignado.
     *
     * @returns string | undefined - Número de tarjeta o undefined.
     */
    getNumeroTarjeta() {
        return this.numeroTarjeta;
    }
    /**
     * Establece el número de tarjeta asignado.
     *
     * @param numeroTarjeta - Nuevo número de tarjeta.
     */
    setNumeroTarjeta(numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
    }
    /**
     * Obtiene el número de cuenta asignado.
     *
     * @returns string | undefined - Número de cuenta o undefined.
     */
    getNumeroCuenta() {
        return this.numeroCuenta;
    }
    /**
     * Establece el número de cuenta asignado.
     *
     * @param numeroCuenta - Nuevo número de cuenta.
     */
    setNumeroCuenta(numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }
    /**
     * Convierte el contrato a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string del contrato.
     */
    toString() {
        return `Contrato [id=${this.id}, fechaGeneracion=${this.fechaGeneracion}, monto=${this.monto}, estado=${this.estado}, solicitudFormalId=${this.solicitudFormalId}, clienteId=${this.clienteId}, numeroTarjeta=${this.numeroTarjeta || 'No asignado'}, numeroCuenta=${this.numeroCuenta || 'No asignado'}]`;
    }
    /**
     * Convierte el contrato a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos del contrato.
     */
    toPlainObject() {
        return {
            id: this.id,
            fechaGeneracion: this.fechaGeneracion,
            monto: this.monto,
            estado: this.estado,
            solicitudFormalId: this.solicitudFormalId,
            clienteId: this.clienteId,
            numeroTarjeta: this.numeroTarjeta,
            numeroCuenta: this.numeroCuenta
        };
    }
    /**
     * Crea una instancia de Contrato desde un mapa de datos.
     * Método estático para crear contratos desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Contrato - Nueva instancia de Contrato.
     */
    static fromMap(map) {
        return new Contrato(map.id, map.fechaGeneracion, map.monto, map.estado, map.solicitudFormalId, map.clienteId, map.numeroTarjeta, map.numeroCuenta);
    }
    /**
     * Genera el PDF del contrato.
     * Método que debe ser implementado para crear el documento PDF del contrato.
     *
     * @throws Error - Siempre lanza error indicando que no está implementado.
     */
    generarPDF() {
        throw new Error("Method not implemented.");
    }
}
exports.Contrato = Contrato;
