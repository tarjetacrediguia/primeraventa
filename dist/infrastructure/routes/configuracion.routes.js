"use strict";
// src/infrastructure/routes/configuracion.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Configuración
 *
 * Este archivo define las rutas para la gestión de la configuración del sistema.
 * Permite a los administradores obtener, actualizar y crear configuraciones.
 * Todas las rutas están protegidas por el middleware de rol de administrador.
 */
const express_1 = require("express");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const Configuracion_controller_1 = require("./controllers/Configuracion.controller");
const router = (0, express_1.Router)();
// Obtener toda la configuración
router.get('/', rolesMiddleware_1.esAdministrador, Configuracion_controller_1.getConfiguracion);
router.put('/', rolesMiddleware_1.esAdministrador, Configuracion_controller_1.updateConfiguracion);
// Crear nueva configuración
router.post('/', rolesMiddleware_1.esAdministrador, Configuracion_controller_1.createConfiguracion);
exports.default = router;
