// src/infrastructure/routes/permisos.routes.ts
import { Router } from 'express';
import { authMiddleware } from './middlewares/auth.middleware';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { asignarPermisosARol, asignarPermisosAUsuario, crearPermiso, listarPermisos,obtenerPermisosUsuario,verificarPermisoUsuario  } from './controllers/Permisos.controller';

const router = Router();

// Solo administradores pueden acceder a estas rutas
router.use(authMiddleware);
router.use(esAdministrador);

router.post('/', crearPermiso);
router.get('/', listarPermisos);
router.put('/rol/:rol', asignarPermisosARol);
router.put('/asignar-permisos/:id', asignarPermisosAUsuario);
router.get('/usuario/:id', obtenerPermisosUsuario);
router.get('/verificar-permiso/:id', verificarPermisoUsuario);


export default router;