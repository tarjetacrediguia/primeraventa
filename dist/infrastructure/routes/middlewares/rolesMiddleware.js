"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAdministrador = void 0;
const esAdministrador = (req, res, next) => {
    console.log('Verificando rol de administrador...');
    console.log('Usuario autenticado:', req.user);
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    // Verificar rol de administrador
    if (req.user.rol !== 'administrador') {
        console.log(`Rol actual: ${req.user.rol}, Rol requerido: administrador`);
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};
exports.esAdministrador = esAdministrador;
