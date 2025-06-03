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
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
// Aplica el middleware de autenticación a TODAS las rutas excepto las públicas
router.use(auth_middleware_1.authMiddleware);
router.use('/administradores', administradores_routes_1.default);
//router.use('/analistas', analistasRoutes);
//router.use('/comerciantes', comerciantesRoutes);
//router.use('/permisos', permisosRoutes);
//router.use('/solicitudes', solicitudesRoutes);
//router.use('/contratos', contratosRoutes);
//router.use('/estadisticas', estadisticasRoutes);
//router.use('/notificaciones', notificacionesRoutes);
//router.use('/configuracion', configuracionRoutes);
//router.use('/tareas', tareasRoutes);
//router.use('/sistema', sistemaRoutes);
exports.default = router;
