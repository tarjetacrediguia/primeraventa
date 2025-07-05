"use strict";
// src/infrastructure/routes/administradores.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Administradores
 *
 * Este archivo define las rutas para la gestión de administradores en el sistema.
 * Permite crear, actualizar, eliminar, obtener y listar administradores.
 * Todas las rutas están protegidas por el middleware de rol de administrador.
 */
const express_1 = require("express");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const Administradores_controller_1 = require("./controllers/Administradores.controller");
const router = (0, express_1.Router)();
// Crear nuevo administrador
router.post('/', rolesMiddleware_1.esAdministrador, Administradores_controller_1.createAdministrador);
// Actualizar administrador existente
router.put('/:id', rolesMiddleware_1.esAdministrador, Administradores_controller_1.updateAdministrador);
// Eliminar administrador
router.delete('/:id', rolesMiddleware_1.esAdministrador, Administradores_controller_1.deleteAdministrador);
// Obtener administrador por ID
router.get('/:id', rolesMiddleware_1.esAdministrador, Administradores_controller_1.getAdministrador);
// Listar todos los administradores
router.get('/', rolesMiddleware_1.esAdministrador, Administradores_controller_1.listAdministradores);
exports.default = router;
