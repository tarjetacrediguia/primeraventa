//src/infrastructure/routes/solicitudes.routes.ts
import { Router } from 'express';
import {
  crearSolicitudInicial,
  listarSolicitudesIniciales,
  verificarEstadoCrediticio,
  crearSolicitudFormal,
  aprobarSolicitudFormal,
  rechazarSolicitudFormal,
  listarSolicitudesFormales,
  actualizarSolicitudFormal,
  obtenerDetalleSolicitudFormal,
  listarSolicitudesInicialesByComercianteYEstado,
  listarSolicitudesFormalesByComercianteYEstado
} from './controllers/Solicitudes.controller';
import { esComerciante, esAnalista, esComercianteOAnalista, esAdministrador, esAnalistaOAdministrador } from './middlewares/rolesMiddleware';

const router = Router();

// Rutas para solicitudes iniciales
router.post('/solicitudes-iniciales',esComercianteOAnalista, crearSolicitudInicial);//Analizar si solo comerciante puede crear solicitudes iniciales
router.get('/solicitudes-iniciales', esComercianteOAnalista, listarSolicitudesIniciales);
router.get(
    '/solicitudes-iniciales-comerciante', 
    esComercianteOAnalista, 
    listarSolicitudesInicialesByComercianteYEstado
);

// Ruta para verificación crediticia (NOSIS/VERAZ)
router.post('/verificacion-crediticia', esComerciante, verificarEstadoCrediticio);//Analizar si este ednpoint debe existir.

// Rutas para solicitudes formales
router.post('/solicitudes-formales', esComerciante, crearSolicitudFormal);
router.put('/solicitudes-formales/:id/aprobar', esAnalistaOAdministrador, aprobarSolicitudFormal);
router.put('/solicitudes-formales/:id/rechazar', esAnalistaOAdministrador, rechazarSolicitudFormal);
router.get('/solicitudes-formales', esComercianteOAnalista, listarSolicitudesFormales);
router.put('/solicitudes-formales/:id', esAnalista, actualizarSolicitudFormal);
router.get('/solicitudes-formales/:id/detalle', esComercianteOAnalista, obtenerDetalleSolicitudFormal);
router.get(
    '/solicitudes-formales-comerciante', 
    esComercianteOAnalista, 
    listarSolicitudesFormalesByComercianteYEstado
);

export default router;