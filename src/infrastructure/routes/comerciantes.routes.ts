import { Router } from 'express';
import { createComerciante, deleteComerciante, getComerciante, listComerciantes, updateComerciante } from './controllers/Comerciantes.controller';
import { esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

/**
 * RUTAS: Comerciantes
 *
 * Este archivo define las rutas para la gestión de comerciantes en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar comerciantes.
 * Todas las rutas están protegidas por el middleware de rol de comerciante o analista.
 */

// Rutas protegidas que requieren autenticación
router.post('/', esComercianteOAnalista, createComerciante);
router.put('/:id', esComercianteOAnalista, updateComerciante);
router.delete('/:id', esComercianteOAnalista, deleteComerciante);
router.get('/:id', esComercianteOAnalista, getComerciante);
router.get('/', esComercianteOAnalista, listComerciantes);

export default router;
