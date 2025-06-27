import { Router } from 'express';
import { createComerciante, deleteComerciante, getComerciante, listComerciantes, updateComerciante } from './controllers/Comerciantes.controller';
import { esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

// Rutas protegidas que requieren autenticación
router.post('/', esComercianteOAnalista, createComerciante);
router.put('/:id', esComercianteOAnalista, updateComerciante);
router.delete('/:id', esComercianteOAnalista, deleteComerciante);
router.get('/:id', esComercianteOAnalista, getComerciante);
router.get('/', esComercianteOAnalista, listComerciantes);

export default router;
