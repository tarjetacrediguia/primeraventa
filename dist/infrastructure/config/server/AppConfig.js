"use strict";
// src/infrastructure/config/app.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
// Validar que JWT_SECRET esté configurado en producción
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error("⛔ JWT_SECRET no configurado en producción");
}
exports.appConfig = {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3001'),
    httpsPort: parseInt(process.env.HTTPS_PORT || '443'), // Nuevo puerto seguro
    jwtSecret: process.env.JWT_SECRET || '',
    systemToken: process.env.SYSTEM_TOKEN || 'dev_system_token',
};
