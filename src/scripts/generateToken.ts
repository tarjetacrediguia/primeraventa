// File: src/scripts/generateToken.ts

/**
 * SCRIPT: Generador de Token de API
 *
 * Este script permite generar un token JWT para pruebas o uso manual en la API.
 * Imprime el token generado y ejemplos de uso por consola.
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kjhskdf65454sdfkhvxtu_clave_secreta_muy_segura';

export const generateToken = (): string => {
  const payload = {
    type: 'api_token',
    timestamp: new Date().toISOString()
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '100y' // Token que no vence (100 años)
  });
};

// Script para generar un token desde la línea de comandos
if (require.main === module) {
  const token = generateToken();
} 
