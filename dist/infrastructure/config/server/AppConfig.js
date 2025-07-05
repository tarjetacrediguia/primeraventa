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
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_key',
    systemToken: process.env.SYSTEM_TOKEN || 'dev_system_token',
};
