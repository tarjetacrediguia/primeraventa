"use strict";
//src/infrastructure/routes/estadisticas.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const Estadisticas_controller_1 = require("./controllers/Estadisticas.controller");
const router = (0, express_1.Router)();
// Solo administradores pueden acceder a las estadísticas
router.use(rolesMiddleware_1.esAdministrador);
router.get('/solicitudes-iniciales', Estadisticas_controller_1.getSolicitudesInicialesStats);
router.get('/solicitudes-formales', Estadisticas_controller_1.getSolicitudesFormalesStats);
router.get('/tiempos-aprobacion', Estadisticas_controller_1.getTiemposAprobacionStats);
router.get('/tasa-conversion', Estadisticas_controller_1.getTasaConversionStats);
//router.get('/contratos', getContratosStats);
router.get('/comerciantes', Estadisticas_controller_1.getEstadisticasComerciantes);
router.get('/analistas', Estadisticas_controller_1.getEstadisticasAnalistas);
//router.get('/actividad-sistema', getActividadSistema);
//router.get('/tiempos-resolucion', getTiemposResolucion);
exports.default = router;
