// src/infrastructure/routes/administradores.routes.ts
import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { createAdministrador, deleteAdministrador, getAdministrador, listAdministradores, updateAdministrador } from './controllers/Administradores.controller';


const router = Router();

// Crear nuevo administrador
router.post('/', esAdministrador, createAdministrador);

// Actualizar administrador existente
router.put('/:id', esAdministrador, updateAdministrador);

// Eliminar administrador
router.delete('/:id', esAdministrador, deleteAdministrador);

// Obtener administrador por ID
router.get('/:id', esAdministrador, getAdministrador);

// Listar todos los administradores
router.get('/', esAdministrador, listAdministradores);

export default router;
