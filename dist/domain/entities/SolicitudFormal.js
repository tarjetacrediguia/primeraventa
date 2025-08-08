"use strict";
// src/domain/entities/SolicitudFormal.ts
/**
 * MÓDULO: Entidad Solicitud Formal
 *
 * Este archivo define la clase SolicitudFormal que representa la segunda etapa
 * del proceso de solicitud de préstamo, con información completa del solicitante.
 *
 * Responsabilidades:
 * - Representar solicitudes formales de préstamo
 * - Gestionar información completa del solicitante y referentes
 * - Manejar documentos y recibo de sueldo
 * - Proporcionar funcionalidades de aprobación y gestión
 * - Gestionar números de cuenta y tarjeta asignados
 * - Validar y procesar datos de la solicitud formal
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudFormal = void 0;
const stream_1 = require("stream");
const Referente_1 = require("./Referente");
/**
 * Clase que representa una solicitud formal de préstamo en el sistema.
 * Contiene información completa del solicitante, referentes, documentos
 * y datos de aprobación del préstamo.
 */
class SolicitudFormal {
    /**
     * Constructor de la clase SolicitudFormal.
     * Inicializa una solicitud formal con todos los datos del solicitante y referentes.
     *
     * @param id - Identificador único de la solicitud.
     * @param solicitudInicialId - ID de la solicitud inicial asociada.
     * @param comercianteId - ID del comerciante asociado.
     * @param nombreCompleto - Nombre completo del solicitante.
     * @param apellido - Apellido del solicitante.
     * @param dni - DNI del solicitante.
     * @param telefono - Teléfono del solicitante.
     * @param email - Email del solicitante.
     * @param fechaSolicitud - Fecha de la solicitud.
     * @param recibo - Recibo de sueldo del solicitante.
     * @param estado - Estado actual de la solicitud.
     * @param aceptaTarjeta - Indica si acepta tarjeta de crédito.
     * @param fechaNacimiento - Fecha de nacimiento del solicitante.
     * @param domicilio - Domicilio del solicitante.
     * @param datosEmpleador - Datos del empleador del solicitante.
     * @param referentes - Array de referentes del solicitante.
     * @param comentarios - Array de comentarios sobre la solicitud.
     * @param clienteId - ID del cliente en el sistema.
     * @param numeroTarjeta - Número de tarjeta asignado (opcional).
     * @param numeroCuenta - Número de cuenta asignado (opcional).
     * @param fechaAprobacion - Fecha de aprobación (opcional).
     * @param analistaAprobadorId - ID del analista que aprobó (opcional).
     * @param administradorAprobadorId - ID del administrador que aprobó (opcional).
     * @param importeNeto - Importe neto del solicitante.
     * @param cuotasSolicitadas - Cantidad de cuotas solicitadas (entre 3 y 14).
     */
    constructor(id, solicitudInicialId, comercianteId, nombreCompleto, apellido, dni, telefono, email, fechaSolicitud, recibo, estado, aceptaTarjeta, fechaNacimiento, domicilio, datosEmpleador, referentes, importeNeto, comentarios = [], ponderador, solicitaAmpliacionDeCredito = false, clienteId, fechaAprobacion, analistaAprobadorId, administradorAprobadorId, comercianteAprobadorId, nuevoLimiteCompletoSolicitado) {
        this.id = id;
        this.solicitudInicialId = solicitudInicialId;
        this.comercianteId = comercianteId;
        this.nombreCompleto = nombreCompleto;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.fechaSolicitud = fechaSolicitud;
        this.recibo = recibo;
        this.estado = estado;
        this.aceptaTarjeta = aceptaTarjeta;
        this.fechaNacimiento = fechaNacimiento;
        this.domicilio = domicilio;
        this.datosEmpleador = datosEmpleador;
        this.referentes = referentes || [];
        this.comentarios = comentarios;
        this.clienteId = clienteId;
        this.fechaAprobacion = fechaAprobacion;
        this.analistaAprobadorId = analistaAprobadorId;
        this.administradorAprobadorId = administradorAprobadorId;
        this.importeNeto = importeNeto;
        this.calcularLimites();
        this.ponderador = ponderador;
        this.nuevoLimiteCompletoSolicitado = nuevoLimiteCompletoSolicitado !== null && nuevoLimiteCompletoSolicitado !== void 0 ? nuevoLimiteCompletoSolicitado : null;
        this.solicitaAmpliacionDeCredito = solicitaAmpliacionDeCredito;
    }
    setComercianteAprobadorId(id) {
        this.comercianteAprobadorId = id;
    }
    getComercianteAprobadorId() {
        return this.comercianteAprobadorId;
    }
    /**
     * Obtiene el ponderador de la solicitud.
     *
     * @returns number - Ponderador de la solicitud.
     */
    getPonderador() {
        return this.ponderador;
    }
    /**
     * Establece el ponderador de la solicitud.
     *
     * @param ponderador - Nuevo valor del ponderador.
     */
    setPonderador(ponderador) {
        this.ponderador = ponderador;
        this.calcularLimites(); // Recalcula los límites al cambiar el ponderador
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
     * Establece el ID del analista que aprobó la solicitud.
     *
     * @param analistaId - ID del analista aprobador.
     */
    setAnalistaAprobadorId(analistaId) {
        this.analistaAprobadorId = analistaId;
    }
    /**
     * Obtiene el ID del administrador que aprobó la solicitud.
     *
     * @returns number | undefined - ID del administrador aprobador o undefined.
     */
    getAdministradorAprobadorId() {
        return this.administradorAprobadorId;
    }
    getImporteNeto() {
        return this.importeNeto;
    }
    setImporteNeto(importeNeto) {
        this.importeNeto = importeNeto;
        this.calcularLimites();
    }
    getLimiteBase() {
        return this.limiteBase;
    }
    getLimiteCompleto() {
        return this.limiteCompleto;
    }
    getNuevoLimiteCompletoSolicitado() {
        var _a;
        return (_a = this.nuevoLimiteCompletoSolicitado) !== null && _a !== void 0 ? _a : null;
    }
    setNuevoLimiteCompletoSolicitado(nuevoLimite) {
        this.nuevoLimiteCompletoSolicitado = nuevoLimite;
    }
    isSolicitaAmpliacionDeCredito() {
        return this.solicitaAmpliacionDeCredito;
    }
    setSolicitaAmpliacionDeCredito(solicita) {
        this.solicitaAmpliacionDeCredito = solicita;
    }
    getSolicitaAmpliacionDeCredito() {
        return this.solicitaAmpliacionDeCredito;
    }
    /**
     * Establece el ID del administrador que aprobó la solicitud.
     *
     * @param adminId - ID del administrador aprobador.
     */
    setAdministradorAprobadorId(adminId) {
        this.administradorAprobadorId = adminId;
    }
    /**
     * Obtiene la fecha de aprobación de la solicitud.
     *
     * @returns Date | undefined - Fecha de aprobación o undefined.
     */
    getFechaAprobacion() {
        return this.fechaAprobacion;
    }
    /**
     * Establece la fecha de aprobación de la solicitud.
     *
     * @param fechaAprobacion - Nueva fecha de aprobación.
     */
    setFechaAprobacion(fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }
    /**
     * Obtiene el ID del cliente asociado.
     *
     * @returns number - ID del cliente.
     */
    getClienteId() {
        return this.clienteId || 0; // Retorna 0 si clienteId no está definido
    }
    /**
    * Establece el ID del cliente asociado.
    *
    */
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }
    /**
     * Obtiene el ID de la solicitud inicial asociada.
     *
     * @returns number - ID de la solicitud inicial.
     */
    getSolicitudInicialId() {
        return this.solicitudInicialId;
    }
    /**
     * Obtiene el ID del comerciante asociado.
     *
     * @returns number - ID del comerciante.
     */
    getComercianteId() {
        return this.comercianteId;
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
     * Obtiene el nombre completo del solicitante.
     *
     * @returns string - Nombre completo del solicitante.
     */
    getNombreCompleto() {
        return this.nombreCompleto;
    }
    /**
     * Establece el nombre completo del solicitante.
     *
     * @param nombreCompleto - Nuevo nombre completo del solicitante.
     */
    setNombreCompleto(nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    /**
     * Obtiene el apellido del solicitante.
     *
     * @returns string - Apellido del solicitante.
     */
    getApellido() {
        return this.apellido;
    }
    /**
     * Establece el apellido del solicitante.
     *
     * @param apellido - Nuevo apellido del solicitante.
     */
    setApellido(apellido) {
        this.apellido = apellido;
    }
    /**
     * Obtiene el DNI del solicitante.
     *
     * @returns string - DNI del solicitante.
     */
    getDni() {
        return this.dni;
    }
    /**
     * Establece el DNI del solicitante.
     *
     * @param dni - Nuevo DNI del solicitante.
     */
    setDni(dni) {
        this.dni = dni;
    }
    /**
     * Obtiene el teléfono del solicitante.
     *
     * @returns string - Teléfono del solicitante.
     */
    getTelefono() {
        return this.telefono;
    }
    /**
     * Establece el teléfono del solicitante.
     *
     * @param telefono - Nuevo teléfono del solicitante.
     */
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    /**
     * Obtiene el email del solicitante.
     *
     * @returns string - Email del solicitante.
     */
    getEmail() {
        return this.email;
    }
    /**
     * Establece el email del solicitante.
     *
     * @param email - Nuevo email del solicitante.
     */
    setEmail(email) {
        this.email = email;
    }
    /**
     * Obtiene la fecha de la solicitud.
     *
     * @returns Date - Fecha de la solicitud.
     */
    getFechaSolicitud() {
        return this.fechaSolicitud;
    }
    /**
     * Establece la fecha de la solicitud.
     *
     * @param fechaSolicitud - Nueva fecha de la solicitud.
     */
    setFechaSolicitud(fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }
    /**
     * Obtiene el recibo de sueldo del solicitante.
     *
     * @returns Buffer - Recibo de sueldo.
     */
    getRecibo() {
        return this.recibo;
    }
    /**
     * Establece el recibo de sueldo del solicitante.
     *
     * @param recibo - Nuevo recibo de sueldo.
     */
    setRecibo(recibo) {
        this.recibo = recibo;
    }
    /**
     * Obtiene el estado actual de la solicitud.
     *
     * @returns string - Estado de la solicitud.
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
     * Obtiene si el solicitante acepta tarjeta de crédito.
     *
     * @returns boolean - true si acepta tarjeta, false en caso contrario.
     */
    getAceptaTarjeta() {
        return this.aceptaTarjeta;
    }
    /**
     * Establece si el solicitante acepta tarjeta de crédito.
     *
     * @param aceptaTarjeta - Nuevo valor de aceptación de tarjeta.
     */
    setAceptaTarjeta(aceptaTarjeta) {
        this.aceptaTarjeta = aceptaTarjeta;
    }
    /**
     * Obtiene la fecha de nacimiento del solicitante.
     *
     * @returns Date - Fecha de nacimiento del solicitante.
     */
    getFechaNacimiento() {
        return this.fechaNacimiento;
    }
    /**
     * Establece la fecha de nacimiento del solicitante.
     *
     * @param fechaNacimiento - Nueva fecha de nacimiento del solicitante.
     */
    setFechaNacimiento(fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    /**
     * Obtiene el domicilio del solicitante.
     *
     * @returns string - Domicilio del solicitante.
     */
    getDomicilio() {
        return this.domicilio;
    }
    /**
     * Establece el domicilio del solicitante.
     *
     * @param domicilio - Nuevo domicilio del solicitante.
     */
    setDomicilio(domicilio) {
        this.domicilio = domicilio;
    }
    /**
     * Obtiene los datos del empleador del solicitante.
     *
     * @returns string - Datos del empleador del solicitante.
     */
    getDatosEmpleador() {
        return this.datosEmpleador;
    }
    /**
     * Establece los datos del empleador del solicitante.
     *
     * @param datosEmpleador - Nuevos datos del empleador del solicitante.
     */
    setDatosEmpleador(datosEmpleador) {
        this.datosEmpleador = datosEmpleador;
    }
    /**
     * Obtiene los referentes del solicitante.
     *
     * @returns Referente[] - Array de referentes del solicitante.
     */
    getReferentes() {
        return this.referentes;
    }
    /**
     * Establece los referentes del solicitante.
     *
     * @param referentes - Nuevo array de referentes del solicitante.
     */
    setReferentes(referentes) {
        this.referentes = referentes;
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
    setLimiteCompleto(limiteCompleto) {
        this.limiteCompleto = limiteCompleto;
    }
    /**
     * Convierte la solicitud formal a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string de la solicitud.
     */
    toString() {
        return `SolicitudFormal[id=${this.id}, estado=${this.estado}, solicitante=${this.nombreCompleto} ${this.apellido}]`;
    }
    /**
     * Obtiene el recibo como stream legible.
     * Útil para enviar archivos por HTTP.
     *
     * @returns Readable - Stream del recibo.
     */
    getReciboStream() {
        return stream_1.Readable.from(this.recibo);
    }
    /**
     * Determina el tipo MIME del recibo de sueldo.
     * Utiliza la librería file-type para detectar el tipo de archivo.
     *
     * @returns Promise<string> - Tipo MIME del archivo.
     */
    getReciboMimeType() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileType = yield Promise.resolve().then(() => __importStar(require('file-type')));
            const type = yield fileType.fileTypeFromBuffer(this.recibo);
            return (type === null || type === void 0 ? void 0 : type.mime) || 'application/octet-stream';
        });
    }
    /**
     * Convierte la solicitud formal a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos de la solicitud.
     */
    toPlainObject() {
        return {
            id: this.id,
            nombreCompleto: this.nombreCompleto,
            apellido: this.apellido,
            dni: this.dni,
            telefono: this.telefono,
            email: this.email,
            fechaSolicitud: this.fechaSolicitud,
            recibo: this.recibo,
            estado: this.estado,
            aceptaTarjeta: this.aceptaTarjeta,
            fechaNacimiento: this.fechaNacimiento,
            domicilio: this.domicilio,
            datosEmpleador: this.datosEmpleador,
            referentes: this.referentes.map(r => r.toPlainObject()),
            comentarios: this.comentarios,
            analistaAprobadorId: this.analistaAprobadorId,
            administradorAprobadorId: this.administradorAprobadorId,
            importeNeto: this.importeNeto,
            limiteBase: this.limiteBase,
            limiteCompleto: this.limiteCompleto,
            solicitaAmpliacionDeCredito: this.solicitaAmpliacionDeCredito,
            nuevoLimiteCompletoSolicitado: this.nuevoLimiteCompletoSolicitado
        };
    }
    /**
     * Crea una instancia de SolicitudFormal desde un mapa de datos.
     * Método estático para crear solicitudes desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns SolicitudFormal - Nueva instancia de SolicitudFormal.
     */
    static fromMap(map) {
        return new SolicitudFormal(map.id, map.solicitudInicialId, map.comercianteId, map.nombreCompleto, map.apellido, map.dni, map.telefono, map.email, map.fechaSolicitud, map.recibo, map.estado, map.aceptaTarjeta, map.fechaNacimiento, map.domicilio, map.datosEmpleador, map.referentes.map((r) => Referente_1.Referente.fromMap(r)), map.importeNeto, map.comentarios || [], map.ponderador || 0, map.solicitaAmpliacionDeCredito || false, map.clienteId || 0, map.fechaAprobacion, map.analistaAprobadorId, map.nuevoLimiteCompletoSolicitado);
    }
    // Métodos para cálculos financieros
    calcularLimites() {
        this.limiteBase = this.importeNeto / 2;
        this.limiteCompleto = this.limiteBase * this.ponderador;
    }
    validarCompletitud() {
        const camposRequeridos = [
            this.nombreCompleto,
            this.apellido,
            this.dni,
            this.telefono,
            this.email,
            this.recibo,
            this.fechaNacimiento,
            this.domicilio,
            this.datosEmpleador,
            this.importeNeto
        ];
        if (camposRequeridos.some(campo => {
            if (Buffer.isBuffer(campo))
                return campo.length === 0;
            return !campo || (typeof campo === 'string' && campo.trim() === '');
        })) {
            throw new Error("Faltan datos obligatorios en la solicitud formal");
        }
        if (this.referentes.length === 0) {
            throw new Error("Se requiere al menos un referente");
        }
        if (this.importeNeto <= 0) {
            throw new Error("El importe neto debe ser mayor a cero");
        }
    }
}
exports.SolicitudFormal = SolicitudFormal;
