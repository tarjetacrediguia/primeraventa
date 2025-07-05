"use strict";
// File: src/scripts/generateToken.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
/**
 * SCRIPT: Generador de Token de API
 *
 * Este script permite generar un token JWT para pruebas o uso manual en la API.
 * Imprime el token generado y ejemplos de uso por consola.
 */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'kjhskdf65454sdfkhvxtu_clave_secreta_muy_segura';
const generateToken = () => {
    const payload = {
        type: 'api_token',
        timestamp: new Date().toISOString()
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '100y' // Token que no vence (100 años)
    });
};
exports.generateToken = generateToken;
// Script para generar un token desde la línea de comandos
if (require.main === module) {
    const token = (0, exports.generateToken)();
}
