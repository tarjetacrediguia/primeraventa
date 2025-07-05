// src/infrastructure/routes/auth.routes.ts

/**
 * RUTAS: Autenticación
 *
 * Este archivo define las rutas para la autenticación de usuarios en el sistema.
 * Permite el login, logout y el restablecimiento de contraseña.
 * Estas rutas son públicas y no requieren autenticación previa.
 */
import { Router } from 'express';
import { login, logout, resetPassword } from './controllers/Auth.controller';


const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword); // Cambiado para usar token y nueva contraseña

export default router;
