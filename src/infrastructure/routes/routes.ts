// src/infrastructure/routes/routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import administradoresRoutes from './administradores.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import solicitudesRoutes from './solicitudes.routes';
import notificacionesRoutes from './notification.routes';
import contratosRoutes from './contratos.routes';
import comerciantesRoutes from './comerciantes.routes';
import permisosRoutes from './permisos.routes';
import analistasRoutes from './analistas.routes';
import configuracionRoutes from './configuracion.routes';
import estadisticasRoutes from './estadisticas.routes';


const router = Router();




router.use('/auth', authRoutes);
// Aplica el middleware de autenticación a TODAS las rutas excepto las públicas
router.use(authMiddleware);
router.use('/administradores', administradoresRoutes);
router.use('/analistas', analistasRoutes);
router.use('/comerciantes', comerciantesRoutes);
router.use('/permisos', permisosRoutes);
router.use('/solicitudes', solicitudesRoutes);
router.use('/contratos', contratosRoutes);
router.use('/estadisticas', estadisticasRoutes);
router.use('/notificaciones', notificacionesRoutes);
router.use('/configuracion', configuracionRoutes);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);

export default router;