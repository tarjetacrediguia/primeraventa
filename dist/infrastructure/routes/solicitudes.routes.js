"use strict";
//src/infrastructure/routes/solicitudes.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Solicitudes
 *
 * Este archivo define las rutas para la gestión de solicitudes iniciales y formales,
 * así como la verificación crediticia y operaciones de aprobación/rechazo.
 * Cada ruta está protegida por los middlewares de roles correspondientes.
 */
const express_1 = require("express");
const Solicitudes_controller_1 = require("./controllers/Solicitudes.controller");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const router = (0, express_1.Router)();
// Rutas para solicitudes iniciales
router.post('/solicitudes-iniciales', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.crearSolicitudInicial);
router.get('/solicitudes-iniciales', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesIniciales);
router.get('/solicitudes-iniciales-comerciante', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesInicialesByComercianteYEstado);
router.put('/solicitudes-iniciales/:id/aprobar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.aprobarSolicitudInicial);
router.put('/solicitudes-iniciales/:id/rechazar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.rechazarSolicitudInicial);
// Ruta para verificación crediticia (NOSIS/VERAZ)
router.post('/verificacion-crediticia', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.verificarEstadoCrediticio); //Analizar si este ednpoint debe existir.
// Rutas para solicitudes formales
router.post('/solicitudes-formales', rolesMiddleware_1.esComerciante, Solicitudes_controller_1.crearSolicitudFormal);
router.put('/solicitudes-formales/:id/aprobar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.aprobarSolicitudFormal);
router.put('/solicitudes-formales/:id/rechazar', rolesMiddleware_1.esAnalistaOAdministrador, Solicitudes_controller_1.rechazarSolicitudFormal);
router.get('/solicitudes-formales', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormales);
router.put('/solicitudes-formales/:id', rolesMiddleware_1.esAnalista, Solicitudes_controller_1.actualizarSolicitudFormal);
router.get('/solicitudes-formales/:id/detalle', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.obtenerDetalleSolicitudFormal);
router.get('/solicitudes-formales-comerciante-estado', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormalesByComercianteYEstado);
router.get('/solicitudes-formales-comerciante/:id', rolesMiddleware_1.esComercianteOAnalista, Solicitudes_controller_1.listarSolicitudesFormalesByComerciante);
exports.default = router;
