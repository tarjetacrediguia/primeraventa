"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAdministrador = void 0;
const esAdministrador = (req, res, next) => {
    console.log(req.user); // Para depuración, ver el usuario autenticado
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
