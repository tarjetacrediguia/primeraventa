"use strict";
/**
 * MÓDULO: Entidad Notificación
 *
 * Este archivo define la clase Notificacion que representa las notificaciones
 * del sistema enviadas a los usuarios para informar sobre eventos importantes.
 *
 * Responsabilidades:
 * - Representar notificaciones del sistema
 * - Gestionar el estado de lectura de notificaciones
 * - Proporcionar funcionalidades de creación y gestión
 * - Manejar metadatos específicos de cada tipo de notificación
 * - Facilitar la verificación de notificaciones recientes
 *
 * @author Sistema de Gestión
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacion = void 0;
/**
 * Clase que representa una notificación en el sistema.
 * Contiene información sobre el mensaje, destinatario, tipo y estado
 * de lectura de la notificación.
 */
class Notificacion {
    /**
     * Constructor de la clase Notificacion.
     * Inicializa una notificación con todos sus datos básicos.
     *
     * @param id - Identificador único de la notificación.
     * @param userId - ID del usuario destinatario.
     * @param type - Tipo de notificación.
     * @param message - Mensaje de la notificación.
     * @param read - Indica si la notificación ha sido leída.
     * @param createdAt - Fecha de creación de la notificación.
     * @param metadata - Metadatos adicionales de la notificación (opcional).
     */
    constructor(id, userId, type, message, read, createdAt, metadata) {
        this._id = id;
        this._userId = userId;
        this._type = type;
        this._message = message;
        this._read = read;
        this._createdAt = createdAt;
        this._metadata = metadata;
    }
    /**
     * Obtiene el ID único de la notificación.
     *
     * @returns number - ID de la notificación.
     */
    get id() {
        return this._id;
    }
    /**
     * Obtiene el ID del usuario destinatario.
     *
     * @returns number - ID del usuario.
     */
    get userId() {
        return this._userId;
    }
    /**
     * Obtiene el tipo de notificación.
     *
     * @returns string - Tipo de notificación.
     */
    get type() {
        return this._type;
    }
    /**
     * Obtiene el mensaje de la notificación.
     *
     * @returns string - Mensaje de la notificación.
     */
    get message() {
        return this._message;
    }
    /**
     * Obtiene si la notificación ha sido leída.
     *
     * @returns boolean - true si ha sido leída, false en caso contrario.
     */
    get read() {
        return this._read;
    }
    /**
     * Obtiene la fecha de creación de la notificación.
     *
     * @returns Date - Fecha de creación.
     */
    get createdAt() {
        return this._createdAt;
    }
    /**
     * Obtiene los metadatos de la notificación.
     *
     * @returns any | undefined - Metadatos de la notificación o undefined.
     */
    get metadata() {
        return this._metadata;
    }
    /**
     * Establece el ID único de la notificación.
     *
     * @param value - Nuevo ID de la notificación.
     */
    set id(value) {
        this._id = value;
    }
    /**
     * Establece el ID del usuario destinatario.
     *
     * @param value - Nuevo ID del usuario.
     */
    set userId(value) {
        this._userId = value;
    }
    /**
     * Establece el tipo de notificación.
     *
     * @param value - Nuevo tipo de notificación.
     */
    set type(value) {
        this._type = value;
    }
    /**
     * Establece el mensaje de la notificación.
     *
     * @param value - Nuevo mensaje de la notificación.
     */
    set message(value) {
        this._message = value;
    }
    /**
     * Establece si la notificación ha sido leída.
     *
     * @param value - Nuevo estado de lectura.
     */
    set read(value) {
        this._read = value;
    }
    /**
     * Establece la fecha de creación de la notificación.
     *
     * @param value - Nueva fecha de creación.
     */
    set createdAt(value) {
        this._createdAt = value;
    }
    /**
     * Establece los metadatos de la notificación.
     *
     * @param value - Nuevos metadatos de la notificación.
     */
    set metadata(value) {
        this._metadata = value;
    }
    /**
     * Marca la notificación como leída.
     */
    markAsRead() {
        this._read = true;
    }
    /**
     * Marca la notificación como no leída.
     */
    markAsUnread() {
        this._read = false;
    }
    /**
     * Convierte la notificación a una representación de string.
     * Útil para logging y debugging.
     *
     * @returns string - Representación en string de la notificación.
     */
    toString() {
        return `Notificación [ID: ${this._id}, Usuario: ${this._userId}, Tipo: ${this._type}, Leída: ${this._read}]`;
    }
    /**
     * Convierte la notificación a un objeto plano.
     * Útil para serialización y transferencia de datos.
     *
     * @returns any - Objeto plano con todos los datos de la notificación.
     */
    /*
    public toPlainObject(): any {
        return {
            id: this._id,
            userId: this._userId,
            type: this._type,
            message: this._message,
            read: this._read,
            createdAt: this._createdAt,
            metadata: this._metadata
        };
    }
        */
    toPlainObject() {
        // Crear copia de metadata sin el campo 'pdf'
        const filteredMetadata = Object.assign({}, this._metadata);
        delete filteredMetadata.pdf;
        return {
            id: this._id,
            userId: this._userId,
            type: this._type,
            message: this._message,
            read: this._read,
            createdAt: this._createdAt,
            metadata: filteredMetadata
        };
    }
    /**
     * Crea una instancia de Notificacion desde un mapa de datos.
     * Método estático para crear notificaciones desde datos serializados.
     *
     * @param map - Mapa de datos para crear la instancia.
     * @returns Notificacion - Nueva instancia de Notificacion.
     */
    static fromMap(map) {
        return new Notificacion(map.id, map.userId, map.type, map.message, map.read, map.createdAt, map.metadata);
    }
    /**
     * Crea un objeto de notificación para ser enviado.
     * Método estático para crear notificaciones sin persistir.
     *
     * @param userId - ID del usuario destinatario.
     * @param type - Tipo de notificación.
     * @param message - Mensaje de la notificación.
     * @param metadata - Metadatos adicionales (opcional).
     * @returns object - Objeto de notificación para envío.
     */
    static create(userId, type, message, metadata) {
        return {
            userId,
            type,
            message,
            metadata
        };
    }
    /**
     * Verifica si la notificación es de un tipo específico.
     *
     * @param notificationType - Tipo de notificación a verificar.
     * @returns boolean - true si es del tipo especificado, false en caso contrario.
     */
    isOfType(notificationType) {
        return this._type === notificationType;
    }
    /**
     * Verifica si la notificación es reciente (en los últimos X minutos).
     *
     * @param minutes - Número de minutos para considerar como reciente.
     * @returns boolean - true si es reciente, false en caso contrario.
     */
    isRecent(minutes) {
        const now = new Date();
        const diffInMinutes = (now.getTime() - this._createdAt.getTime()) / (1000 * 60);
        return diffInMinutes <= minutes;
    }
}
exports.Notificacion = Notificacion;
