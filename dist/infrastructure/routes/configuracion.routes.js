"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/configuracion.routes.ts
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
