//src/infrastructure/routes/estadisticas.routes.ts

/**
 * RUTAS: Estadísticas
 *
 * Este archivo define las rutas para la obtención de estadísticas del sistema.
 * Permite a los administradores consultar estadísticas de solicitudes, tiempos, tasas y usuarios.
 * Todas las rutas están protegidas por el middleware de rol de administrador.
 */

import { Router } from 'express';
import { esAdministrador } from './middlewares/rolesMiddleware';
import { 
  getSolicitudesInicialesStats,
  getSolicitudesFormalesStats,
  getTiemposAprobacionStats,
  getTasaConversionStats,
  getEstadisticasComerciantes,
  getEstadisticasAnalistas
} from './controllers/Estadisticas.controller';

const router = Router();

// Solo administradores pueden acceder a las estadísticas
router.use(esAdministrador);

router.get('/solicitudes-iniciales', getSolicitudesInicialesStats);
router.get('/solicitudes-formales', getSolicitudesFormalesStats);
router.get('/tiempos-aprobacion', getTiemposAprobacionStats);
router.get('/tasa-conversion', getTasaConversionStats);
//router.get('/contratos', getContratosStats);
router.get('/comerciantes', getEstadisticasComerciantes);
router.get('/analistas', getEstadisticasAnalistas);
//router.get('/actividad-sistema', getActividadSistema);
//router.get('/tiempos-resolucion', getTiemposResolucion);

export default router;
