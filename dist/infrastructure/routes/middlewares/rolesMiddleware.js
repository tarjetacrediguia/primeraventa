"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAnalistaOAdministrador = exports.esComercianteOAnalista = exports.esAnalista = exports.esComerciante = exports.esAdministrador = void 0;
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
const esComercianteOAnalista = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ error: 'No autenticado' });
    if (req.user.rol !== 'comerciante' && req.user.rol !== 'analista') {
        return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de comerciante o analista' });
    }
    next();
};
exports.esComercianteOAnalista = esComercianteOAnalista;
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
