// src/infrastructure/routes/auth.routes.ts
import { Router } from 'express';
import { login, logout, resetPassword } from './controllers/Auth.controller';


const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword); // Cambiado para usar token y nueva contraseña

export default router;