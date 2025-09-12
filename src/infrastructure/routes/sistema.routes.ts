// src/infrastructure/routes/sistema.routes.ts
import { Router } from 'express';
import { getVersion } from './controllers/Sistema.controller';

const router = Router();

// Ruta pública sin autenticación
router.get('/version', getVersion);

export default router;