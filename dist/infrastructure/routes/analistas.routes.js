"use strict";
//src/infrastructure/routes/analistas.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Analistas
 *
 * Este archivo define las rutas para la gestión de analistas en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar analistas.
 * Todas las rutas están protegidas por el middleware de rol de analista o administrador.
 */
const express_1 = require("express");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const Analistas_controller_1 = require("./controllers/Analistas.controller");
const router = (0, express_1.Router)();
// Crear nuevo analista
router.post('/', rolesMiddleware_1.esAnalistaOAdministrador, Analistas_controller_1.createAnalista);
// Actualizar analista existente
router.put('/:id', rolesMiddleware_1.esAnalistaOAdministrador, Analistas_controller_1.updateAnalista);
// Eliminar analista
router.delete('/:id', rolesMiddleware_1.esAnalistaOAdministrador, Analistas_controller_1.deleteAnalista);
// Obtener analista por ID
router.get('/:id', rolesMiddleware_1.esAnalistaOAdministrador, Analistas_controller_1.getAnalista);
// Listar todos los analistas
router.get('/', rolesMiddleware_1.esAnalistaOAdministrador, Analistas_controller_1.listAnalistas);
exports.default = router;
