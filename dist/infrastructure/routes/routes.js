"use strict";
// src/infrastructure/routes/routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS PRINCIPALES: Router Central
 *
 * Este archivo define el router principal que agrupa todas las rutas del sistema.
 * Configura los middlewares de autenticación y organiza las rutas por módulos.
 * Es el punto de entrada para todas las rutas de la API.
 */
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const administradores_routes_1 = __importDefault(require("./administradores.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const solicitudes_routes_1 = __importDefault(require("./solicitudes.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const contratos_routes_1 = __importDefault(require("./contratos.routes"));
const comerciantes_routes_1 = __importDefault(require("./comerciantes.routes"));
const permisos_routes_1 = __importDefault(require("./permisos.routes"));
const analistas_routes_1 = __importDefault(require("./analistas.routes"));
const configuracion_routes_1 = __importDefault(require("./configuracion.routes"));
const estadisticas_routes_1 = __importDefault(require("./estadisticas.routes"));
const historial_routes_1 = __importDefault(require("./historial.routes"));
const tasas_routes_1 = __importDefault(require("./tasas.routes"));
const compra_routes_1 = __importDefault(require("./compra.routes"));
const sistema_routes_1 = __importDefault(require("./sistema.routes"));
const router = (0, express_1.Router)();
// Rutas públicas sin autenticación
router.use('/auth', auth_routes_1.default);
router.use('/sistema', sistema_routes_1.default);
// Aplica el middleware de autenticación a TODAS las rutas excepto las públicas
router.use(auth_middleware_1.authMiddleware);
router.use('/administradores', administradores_routes_1.default);
router.use('/analistas', analistas_routes_1.default);
router.use('/comerciantes', comerciantes_routes_1.default);
router.use('/permisos', permisos_routes_1.default);
router.use('/solicitudes', solicitudes_routes_1.default);
router.use('/contratos', contratos_routes_1.default);
router.use('/estadisticas', estadisticas_routes_1.default);
router.use('/notificaciones', notification_routes_1.default);
router.use('/configuracion', configuracion_routes_1.default);
router.use('/historial', historial_routes_1.default);
router.use('/tasas', tasas_routes_1.default);
router.use('/compra', compra_routes_1.default);
//router.use('/simulacion', simulacionRoutes);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);
exports.default = router;
