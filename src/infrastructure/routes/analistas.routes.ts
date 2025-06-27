//src/infrastructure/routes/analistas.routes.ts
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