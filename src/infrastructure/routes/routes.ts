// src/infrastructure/routes/routes.ts

/**
 * RUTAS PRINCIPALES: Router Central
 *
 * Este archivo define el router principal que agrupa todas las rutas del sistema.
 * Configura los middlewares de autenticación y organiza las rutas por módulos.
 * Es el punto de entrada para todas las rutas de la API.
 */
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
import historialRoutes from './historial.routes';
import tasasRoutes from './tasas.routes';
import compraRoutes from './compra.routes';


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
router.use('/historial', historialRoutes);
router.use('/tasas', tasasRoutes);
router.use('/compra', compraRoutes);
//router.use('/simulacion', simulacionRoutes);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);

export default router;
