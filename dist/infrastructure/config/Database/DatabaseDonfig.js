"use strict";
//src/infrastructure/config/Database/DatabaseConfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
/**
 * CONFIGURACIÓN: Base de Datos PostgreSQL
 *
 * Este archivo define la configuración de conexión a la base de datos PostgreSQL.
 * Crea un pool de conexiones con los parámetros de entorno configurados.
 * Incluye configuración SSL para entornos de producción.
 */
const pg_1 = require("pg");
// Configuración de la conexión a la base de datos
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
