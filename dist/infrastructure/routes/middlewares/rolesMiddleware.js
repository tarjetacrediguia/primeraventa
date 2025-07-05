"use strict";
// src/infrastructure/routes/middlewares/rolesMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAnalistaOAdministrador = exports.esComercianteOAnalista = exports.esAnalista = exports.esComerciante = exports.esAdministrador = void 0;
/**
 * Middleware que permite el acceso solo a administradores.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si el usuario es administrador, o responde con error si no lo es.
 */
const esAdministrador = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    // Verificar rol de administrador
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({
            error: 'Acceso no autorizado. Se requiere rol de administrador'
        });
    }
    next();
};
exports.esAdministrador = esAdministrador;
// Verifica si el usuario es un comerciante
/**
 * Middleware que permite el acceso solo a comerciantes.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si el usuario es comerciante, o responde con error si no lo es.
 */
const esComerciante = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado' });
    if (req.user.rol !== 'comerciante') {
        return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de comerciante' });
    }
    next();
};
exports.esComerciante = esComerciante;
//Verifica si el usuario es un analista
/**
 * Middleware que permite el acceso solo a analistas.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si el usuario es analista, o responde con error si no lo es.
 */
const esAnalista = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado' });
    if (req.user.rol !== 'analista') {
        return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de analista' });
    }
    next();
};
exports.esAnalista = esAnalista;
// Verifica si el usuario es un comerciante o analista
/**
 * Middleware que permite el acceso a comerciantes o analistas.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si el usuario es comerciante o analista, o responde con error si no lo es.
 */
const esComercianteOAnalista = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado' });
    if (req.user.rol !== 'comerciante' && req.user.rol !== 'analista') {
        return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de comerciante o analista' });
    }
    next();
};
exports.esComercianteOAnalista = esComercianteOAnalista;
/**
 * Middleware que permite el acceso a analistas o administradores.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si el usuario es analista o administrador, o responde con error si no lo es.
 */
const esAnalistaOAdministrador = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado' });
    if (req.user.rol !== 'analista' && req.user.rol !== 'administrador') {
        return res.status(403).json({
            error: 'Acceso no autorizado. Se requiere rol de analista o administrador'
        });
    }
    next();
};
exports.esAnalistaOAdministrador = esAnalistaOAdministrador;
