// src/infrastructure/routes/routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import administradoresRoutes from './administradores.routes';
import { authMiddleware } from './middlewares/auth.middleware';
<<<<<<< HEAD
import solicitudesRoutes from './solicitudes.routes';
import notificacionesRoutes from './notification.routes';
import contratosRoutes from './contratos.routes';

=======
import analistasRoutes from './analistas.routes';
>>>>>>> origin/jurgen
const router = Router();
import comerciantesRoutes from './comerciantes.routes';



router.use('/auth', authRoutes);
// Aplica el middleware de autenticación a TODAS las rutas excepto las públicas
router.use(authMiddleware);
router.use('/administradores', administradoresRoutes);
router.use('/analistas', analistasRoutes);
router.use('/comerciantes', comerciantesRoutes);
//router.use('/permisos', permisosRoutes);
router.use('/solicitudes', solicitudesRoutes);
router.use('/contratos', contratosRoutes);
//router.use('/estadisticas', estadisticasRoutes);
router.use('/notificaciones', notificacionesRoutes);
//router.use('/configuracion', configuracionRoutes);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);

export default router;