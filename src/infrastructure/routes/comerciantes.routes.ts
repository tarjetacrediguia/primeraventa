import { Router } from 'express';
import { createComerciante, deleteComerciante, getComerciante, listComerciantes, updateComerciante } from './controllers/Comerciantes.controller';
import { esAdministrador, esComerciante, esComercianteOAdministrador, esComercianteOAnalista } from './middlewares/rolesMiddleware';

const router = Router();

/**
 * RUTAS: Comerciantes
 *
 * Este archivo define las rutas para la gestión de comerciantes en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar comerciantes.
 * Todas las rutas están protegidas por el middleware de rol de comerciante o analista.
 */

// Rutas protegidas que requieren autenticación
router.post('/', esAdministrador, createComerciante);
router.put('/:id', esAdministrador, updateComerciante);
router.delete('/:id', esAdministrador, deleteComerciante);
router.get('/:id', esComercianteOAdministrador, getComerciante);
router.get('/', esAdministrador, listComerciantes);

export default router;
