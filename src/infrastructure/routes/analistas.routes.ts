//src/infrastructure/routes/analistas.routes.ts

/**
 * RUTAS: Analistas
 *
 * Este archivo define las rutas para la gestión de analistas en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar analistas.
 * Todas las rutas están protegidas por el middleware de rol de analista o administrador.
 */
import { Router } from 'express';
import { esAnalistaOAdministrador } from './middlewares/rolesMiddleware';
import { createAnalista, deleteAnalista, getAnalista, listAnalistas, updateAnalista } from './controllers/Analistas.controller';

const router = Router();

// Crear nuevo analista
router.post('/', esAnalistaOAdministrador, createAnalista);

// Actualizar analista existente
router.put('/:id', esAnalistaOAdministrador, updateAnalista);

// Eliminar analista
router.delete('/:id', esAnalistaOAdministrador, deleteAnalista);

// Obtener analista por ID
router.get('/:id', esAnalistaOAdministrador, getAnalista);

// Listar todos los analistas
router.get('/', esAnalistaOAdministrador, listAnalistas);

export default router;
