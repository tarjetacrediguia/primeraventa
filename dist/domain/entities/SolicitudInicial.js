"use strict";
// src/domain/entities/SolicitudInicial.ts
/**
 * MÓDULO: Entidad Solicitud Inicial
 *
 * Este archivo define la clase SolicitudInicial que representa la primera etapa
 * del proceso de solicitud de préstamo en el sistema.
 *
 * Responsabilidades:
 * - Representar solicitudes iniciales de préstamo
 * - Gestionar el estado de la solicitud (pendiente, aprobada, rechazada, expirada)
 * - Manejar información básica del cliente y documentos
 * - Proporcionar funcionalidades de aprobación y comentarios
 * - Validar datos de la solicitud inicial
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudInicial = void 0;
/**
 * Clase que representa una solicitud inicial de préstamo en el sistema.
 * Contiene la información básica del cliente, documentos requeridos y
 * el estado del proceso de aprobación inicial.
 */
class SolicitudInicial {
    /**
     * Constructor de la clase SolicitudInicial.
     * Inicializa una solicitud inicial con todos sus datos básicos.
     *
     * @param id - Identificador único de la solicitud.
     * @param fechaCreacion - Fecha de creación de la solicitud.
     * @param estado - Estado actual de la solicitud.
     * @param dniCliente - DNI del cliente solicitante.
     * @param clienteId - ID del cliente en el sistema.
     * @param cuilCliente - CUIL del cliente (opcional).
     * @param reciboSueldo - Recibo de sueldo del cliente (opcional).
     * @param comercianteId - ID del comerciante asociado (opcional).
     * @param comentarios - Array de comentarios sobre la solicitud.
     * @param analistaAprobadorId - ID del analista que aprobó (opcional).
     * @param administradorAprobadorId - ID del administrador que aprobó (opcional).
     */
    constructor(id, fechaCreacion, estado, clienteId, comercianteId, comentarios = [], analistaAprobadorId, administradorAprobadorId, dniCliente, cuilCliente) {
        this.id = id;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.dniCliente = dniCliente;
        this.cuilCliente = cuilCliente;
        this.comercianteId = comercianteId;
        this.comentarios = comentarios;
        this.clienteId = clienteId;
        this.analistaAprobadorId = analistaAprobadorId;
        this.administradorAprobadorId = administradorAprobadorId;
    }
    /**
     * Establece el ID del analista que aprobó la solicitud.
     *
     * @param id - ID del analista aprobador.
     */
    setAnalistaAprobadorId(id) {
        this.analistaAprobadorId = Number(id);
    }
    /**
     * Establece el ID del administrador que aprobó la solicitud.
     *
     * @param id - ID del administrador aprobador.
     */
    setAdministradorAprobadorId(id) {
        this.administradorAprobadorId = Number(id);
    }
    /**
     * Obtiene el ID del analista que aprobó la solicitud.
     *
     * @returns number | undefined - ID del analista aprobador o undefined.
     */
    getAnalistaAprobadorId() {
        return this.analistaAprobadorId;
    }
    /**
     * Obtiene el ID del administrador que aprobó la solicitud.
     *
     * @returns number | undefined - ID del administrador aprobador o undefined.
     */
    getAdministradorAprobadorId() {
        return this.administradorAprobadorId;
    }
    /**
     * Obtiene el ID del cliente asociado a la solicitud.
     *
     * @returns number - ID del cliente.
     */
    getClienteId() {
        return this.clienteId;
    }
    /**
     * Establece el ID del cliente asociado a la solicitud.
     *
     * @param clienteId - Nuevo ID del cliente.
     */
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    /**
     * Obtiene el ID único de la solicitud.
     *
     * @returns number - ID de la solicitud.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene la fecha de creación de la solicitud.
     *
     * @returns Date - Fecha de creación.
     */
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    /**
     * Establece la fecha de creación de la solicitud.
     *
     * @param fechaCreacion - Nueva fecha de creación.
     */
    setFechaCreacion(fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    /**
     * Obtiene el estado actual de la solicitud.
     *
     * @returns "pendiente" | "aprobada" | "rechazada" | "expirada" - Estado de la solicitud.
     */
    getEstado() {
        return this.estado;
    }
    /**
     * Establece el estado de la solicitud.
     *
     * @param estado - Nuevo estado de la solicitud.
     */
    setEstado(estado) {
        this.estado = estado;
    }
    /**
     * Obtiene el DNI del cliente solicitante.
     *
     * @returns string - DNI del cliente.
     */
    getDniCliente() {
        return this.dniCliente || '';
    }
    /**
     * Establece el DNI del cliente solicitante.
     *
     * @param dniCliente - Nuevo DNI del cliente.
     */
    setDniCliente(dniCliente) {
        this.dniCliente = dniCliente;
    }
    /**
     * Obtiene el CUIL del cliente solicitante.
     *
     * @returns string | undefined - CUIL del cliente o undefined.
     */
    getCuilCliente() {
        return this.cuilCliente;
    }
    /**
     * Establece el CUIL del cliente solicitante.
     *
     * @param cuilCliente - Nuevo CUIL del cliente.
     */
    setCuilCliente(cuilCliente) {
        this.cuilCliente = cuilCliente;
    }
    /**
     * Obtiene el recibo de sueldo del cliente.
     *
     * @returns Buffer | undefined - Recibo de sueldo o undefined.
     */
    getReciboSueldo() {
        return this.reciboSueldo;
    }
    /**
     * Establece el recibo de sueldo del cliente.
     *
     * @param reciboSueldo - Nuevo recibo de sueldo.
     */
    setReciboSueldo(reciboSueldo) {
        this.reciboSueldo = reciboSueldo;
    }
    /**
     * Obtiene el ID del comerciante asociado.
     *
     * @returns number | undefined - ID del comerciante o undefined.
     */
    getComercianteId() {
        return this.comercianteId;
    }
    /**
     * Establece el ID del comerciante asociado.
     *
     * @param comercianteId - Nuevo ID del comerciante.
     */
    setComercianteId(comercianteId) {
        this.comercianteId = comercianteId;
    }
    /**
     * Obtiene todos los comentarios de la solicitud.
     *
     * @returns string[] - Array de comentarios.
     */
    getComentarios() {
        return this.comentarios;
    }
    /**
     * Establece todos los comentarios de la solicitud.
     *
     * @param comentarios - Nuevo array de comentarios.
     */
    setComentarios(comentarios) {
        this.comentarios = comentarios;
    }
    /**
     * Agrega un nuevo comentario a la solicitud.
     *
     * @param comentario - Nuevo comentario a agregar.
     */
    agregarComentario(comentario) {
        this.comentarios.push(comentario);
    }
    /**
     * Convierte la solicitud inicial a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string de la solicitud.
     */
    toString() {
        return `SolicitudInicial[id=${this.id}, estado=${this.estado}, fechaCreacion=${this.fechaCreacion.toISOString()}, clienteId=${this.clienteId}, comercianteId=${this.comercianteId}, analistaAprobadorId=${this.analistaAprobadorId}, administradorAprobadorId=${this.administradorAprobadorId}]`;
    }
    /**
     * Convierte la solicitud inicial a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos de la solicitud.
     */
    toPlainObject() {
        return {
            id: this.id,
            fechaCreacion: this.fechaCreacion,
            estado: this.estado,
            //dniCliente: this.dniCliente,
            //cuilCliente: this.cuilCliente,
            reciboSueldo: this.reciboSueldo,
            comercianteId: this.comercianteId,
            comentarios: this.comentarios,
            analistaAprobadorId: this.analistaAprobadorId,
            administradorAprobadorId: this.administradorAprobadorId,
            clienteId: this.clienteId,
            dniCliente: this.dniCliente,
        };
    }
    /**
     * Crea una instancia de SolicitudInicial desde un mapa de datos.
     * Método estático para crear solicitudes desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns SolicitudInicial - Nueva instancia de SolicitudInicial.
     */
    static fromMap(map) {
        return new SolicitudInicial(map.id, map.fechaCreacion, map.estado, 
        //map.dniCliente,
        map.clienteId || 0, 
        //map.cuilCliente,
        map.comercianteId, map.comentarios || [], map.analista_aprobador_id ? Number(map.analista_aprobador_id) : undefined, map.administrador_aprobador_id ? Number(map.administrador_aprobador_id) : undefined, map.dniCliente, map.cuilCliente);
    }
}
exports.SolicitudInicial = SolicitudInicial;
