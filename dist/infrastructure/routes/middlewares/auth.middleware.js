"use strict";
// src/infrastructure/routes/middlewares/auth.middleware.ts
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
exports.authMiddleware = void 0;
const AuthAdapter_1 = require("../../adapters/authorization/AuthAdapter");
const DatabaseDonfig_1 = require("../../config/Database/DatabaseDonfig");
/**
 * Middleware de autenticación para rutas protegidas.
 * @param req - Request de Express, espera el token en el header Authorization.
 * @param res - Response de Express para enviar la respuesta en caso de error.
 * @param next - NextFunction de Express para continuar con la siguiente función middleware.
 * @returns Llama a next() si la autenticación es exitosa, o responde con error si falla.
 */
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Rutas públicas que no requieren autenticación
    const publicRoutes = [
        '/API/v1/auth/login',
        '/API/v1/auth/forgot-password',
        '/API/v1/auth/reset-password',
        '/API/v1/sistema/health'
    ];
    if (publicRoutes.includes(req.originalUrl)) {
        return next();
    }
    // Verificar token en el encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado o formato inválido' });
    }
    const token = authHeader.split(' ')[1];
    const authAdapter = new AuthAdapter_1.AuthAdapter();
    try {
        // Verificar token en la base de datos
        const sessionResult = yield DatabaseDonfig_1.pool.query(`SELECT s.*, u.rol 
       FROM sesiones s
       JOIN usuarios u ON s.usuario_id = u.id
       WHERE s.token = $1 AND s.activa = TRUE AND s.fecha_expiracion > NOW()`, [token]);
        if (sessionResult.rows.length === 0) {
            return res.status(401).json({ error: 'Token inválido o sesión expirada' });
        }
        const session = sessionResult.rows[0];
        // Establecer información del usuario en el request
        req.user = {
            id: session.usuario_id.toString(),
            rol: session.rol
        };
        next();
    }
    catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ error: 'Error de autenticación' });
    }
});
exports.authMiddleware = authMiddleware;
