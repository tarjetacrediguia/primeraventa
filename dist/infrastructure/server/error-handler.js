"use strict";
//src/infrastructure/server/error-handler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Middleware de manejo de errores para Express.
 * @param err - Objeto de error capturado.
 * @param req - Request de Express.
 * @param res - Response de Express para enviar la respuesta de error.
 * @param next - NextFunction de Express para pasar al siguiente middleware.
 * @returns Devuelve una respuesta JSON con el error y el status correspondiente.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    // Manejo específico de errores de autenticación
    if (err.message.includes('Token') || err.message.includes('autorización')) {
        return res.status(401).json({
            error: err.message
        });
    }
    // Error por defecto
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
exports.errorHandler = errorHandler;
