"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacion = void 0;
class Notificacion {
    constructor(id, userId, type, message, read, createdAt, metadata) {
        this._id = id;
        this._userId = userId;
        this._type = type;
        this._message = message;
        this._read = read;
        this._createdAt = createdAt;
        this._metadata = metadata;
    }
    // Getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get type() {
        return this._type;
    }
    get message() {
        return this._message;
    }
    get read() {
        return this._read;
    }
    get createdAt() {
        return this._createdAt;
    }
    get metadata() {
        return this._metadata;
    }
    // Setters
    set id(value) {
        this._id = value;
    }
    set userId(value) {
        this._userId = value;
    }
    set type(value) {
        this._type = value;
    }
    set message(value) {
        this._message = value;
    }
    set read(value) {
        this._read = value;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    set metadata(value) {
        this._metadata = value;
    }
    // Métodos para cambiar el estado de lectura
    markAsRead() {
        this._read = true;
    }
    markAsUnread() {
        this._read = false;
    }
    // Métodos adicionales
    toString() {
        return `Notificación [ID: ${this._id}, Usuario: ${this._userId}, Tipo: ${this._type}, Leída: ${this._read}]`;
    }
    toPlainObject() {
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
    static fromMap(map) {
        return new Notificacion(map.id, map.userId, map.type, map.message, map.read, map.createdAt, map.metadata);
    }
    // Método estático para crear una notificación
    static create(userId, type, message, metadata) {
        return {
            userId,
            type,
            message,
            metadata
        };
    }
    // Método para verificar si es de un tipo específico
    isOfType(notificationType) {
        return this._type === notificationType;
    }
    // Método para verificar si es reciente (en los últimos X minutos)
    isRecent(minutes) {
        const now = new Date();
        const diffInMinutes = (now.getTime() - this._createdAt.getTime()) / (1000 * 60);
        return diffInMinutes <= minutes;
    }
}
exports.Notificacion = Notificacion;
