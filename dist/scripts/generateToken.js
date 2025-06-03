"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
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
    console.log('\n=== Token de API Generado ===');
    console.log('\nToken:');
    console.log(token);
    console.log('\nPara usar el token, inclúyelo en el header de tus peticiones:');
    console.log('Authorization: Bearer <token>');
    console.log('\nEjemplo:');
    console.log('curl -H "Authorization: Bearer ' + token + '" http://localhost:3000/API/v1/getdata\n');
}
