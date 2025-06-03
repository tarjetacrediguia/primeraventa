import { Router } from 'express';
import { authMiddleware } from '../routes/middlewares/auth.middleware';
import { createComerciante, deleteComerciante, getComerciante, listComerciantes, updateComerciante } from './controllers/Comerciantes.controller';

const router = Router();

// Rutas protegidas que requieren autenticación
router.post('/', authMiddleware, createComerciante);
router.put('/:id', authMiddleware, updateComerciante);
router.delete('/:id', authMiddleware, deleteComerciante);
router.get('/:id', authMiddleware, getComerciante);
router.get('/', authMiddleware, listComerciantes);

export default router;
