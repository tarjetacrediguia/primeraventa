// src/infrastructure/routes/permisos.routes.ts
import { Router } from 'express';
import { authMiddleware } from './middlewares/auth.middleware';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { asignarPermisosARol, asignarPermisosAUsuario, crearPermiso, listarPermisos } from './controllers/Permisos.controller';

const router = Router();

// Solo administradores pueden acceder a estas rutas
router.use(authMiddleware);
router.use(esAdministrador);

router.post('/', crearPermiso);
router.get('/', listarPermisos);
router.put('/rol/:rol', asignarPermisosARol);
router.put('/asignar-permisos/:id', asignarPermisosAUsuario);

export default router;