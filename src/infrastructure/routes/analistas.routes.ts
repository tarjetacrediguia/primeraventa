//src/infrastructure/routes/analistas.routes.ts
import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { createAnalista, deleteAnalista, getAnalista, listAnalistas, updateAnalista } from './controllers/Analistas.controller';

const router = Router();

// Crear nuevo analista
router.post('/', esAdministrador, createAnalista);

// Actualizar analista existente
router.put('/:id', esAdministrador, updateAnalista);

// Eliminar analista
router.delete('/:id', esAdministrador, deleteAnalista);

// Obtener analista por ID
router.get('/:id', esAdministrador, getAnalista);

// Listar todos los analistas
router.get('/', esAdministrador, listAnalistas);

export default router;