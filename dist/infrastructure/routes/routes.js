"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/routes.ts
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
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
// Aplica el middleware de autenticación a TODAS las rutas excepto las públicas
router.use(auth_middleware_1.authMiddleware);
router.use('/administradores', administradores_routes_1.default);
router.use('/analistas', analistas_routes_1.default);
router.use('/comerciantes', comerciantes_routes_1.default);
router.use('/permisos', permisos_routes_1.default);
router.use('/solicitudes', solicitudes_routes_1.default);
router.use('/contratos', contratos_routes_1.default);
//router.use('/estadisticas', estadisticasRoutes);
router.use('/notificaciones', notification_routes_1.default);
router.use('/configuracion', configuracion_routes_1.default);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);
exports.default = router;
