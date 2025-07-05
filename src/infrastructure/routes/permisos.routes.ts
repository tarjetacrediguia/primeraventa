// src/infrastructure/routes/permisos.routes.ts

/**
 * RUTAS: Permisos
 *
 * Este archivo define las rutas para la gestión de permisos en el sistema.
 * Permite crear permisos, asignarlos a roles y usuarios, y verificar permisos.
 * Todas las rutas están protegidas por los middlewares de autenticación y rol de administrador.
 */
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
