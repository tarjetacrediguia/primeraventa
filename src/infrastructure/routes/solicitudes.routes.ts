//src/infrastructure/routes/solicitudes.routes.ts

/**
 * RUTAS: Solicitudes
 *
 * Este archivo define las rutas para la gestión de solicitudes iniciales y formales,
 * así como la verificación crediticia y operaciones de aprobación/rechazo.
 * Cada ruta está protegida por los middlewares de roles correspondientes.
 */
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
  listarSolicitudesInicialesByComerciante,
  listarSolicitudesFormalesByComercianteYEstado,
  listarSolicitudesFormalesByComerciante,
  aprobarSolicitudInicial,
  rechazarSolicitudInicial,
  crearYAprobarSolicitudFormal,
  obtenerSolicitudFormalPoridSolicitudInicial,
  obtenerSolicitudFormalAnalista,
  obtenerDatosClienteComerciante,
  descargarArchivoAdjunto,
} from './controllers/Solicitudes.controller';
import { esComerciante, esAnalista, esComercianteOAnalista, esAdministrador, esAnalistaOAdministrador } from './middlewares/rolesMiddleware';

const router = Router();

// Rutas para solicitudes iniciales
router.post('/solicitudes-iniciales',esComercianteOAnalista, crearSolicitudInicial);
router.get('/solicitudes-iniciales', esAnalistaOAdministrador, listarSolicitudesIniciales);
router.get(
    '/solicitudes-iniciales-comerciante', 
    esComerciante, 
    listarSolicitudesInicialesByComerciante
);
router.put(
    '/solicitudes-iniciales/:id/aprobar', 
    esAnalistaOAdministrador, 
    aprobarSolicitudInicial
);

router.put(
    '/solicitudes-iniciales/:id/rechazar', 
    esAnalistaOAdministrador, 
    rechazarSolicitudInicial
);

// Ruta para verificación crediticia (NOSIS/VERAZ)
router.post('/verificacion-crediticia', esComerciante, verificarEstadoCrediticio); //Analizar si este ednpoint debe existir.

// Rutas para solicitudes formales
router.post('/solicitudes-formales', esComerciante, crearSolicitudFormal);
router.put('/solicitudes-formales/:id/aprobar', esComercianteOAnalista, aprobarSolicitudFormal);
router.put('/solicitudes-formales/:id/rechazar', esComercianteOAnalista, rechazarSolicitudFormal);
router.get('/solicitudes-formales', esComercianteOAnalista, listarSolicitudesFormales);
router.put('/solicitudes-formales/:id', esComercianteOAnalista, actualizarSolicitudFormal);
router.get('/solicitudes-formales/:id/detalle', esComercianteOAnalista, obtenerDetalleSolicitudFormal);
router.get(
    '/solicitudes-formales-comerciante-estado', 
    esComercianteOAnalista, 
    listarSolicitudesFormalesByComercianteYEstado
);

router.post(
  '/solicitudes-formales/crearYAprobarSolicitudFormal', 
  esComerciante, 
  crearYAprobarSolicitudFormal
);

router.get(
    '/solicitudes-formales-comerciante', 
    esComercianteOAnalista, 
    listarSolicitudesFormalesByComerciante
);

router.get(
    '/solicitud-formal-comerciante/:idSolicitudInicial',
    esComercianteOAnalista,
    obtenerSolicitudFormalPoridSolicitudInicial
);

router.get(
    '/solicitud-formal-analista/:idSolicitudInicial',
    esAnalistaOAdministrador,
    obtenerSolicitudFormalAnalista
);

router.get(
    '/clientes/:id/comerciante',
    esComerciante,
    obtenerDatosClienteComerciante
);

router.get(
  '/solicitudes-formales/:id/archivos/:archivoId',
  esComercianteOAnalista,
  descargarArchivoAdjunto
)

export default router;