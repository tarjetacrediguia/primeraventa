"use strict";
// src/infrastructure/routes/permisos.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Permisos
 *
 * Este archivo define las rutas para la gestión de permisos en el sistema.
 * Permite crear permisos, asignarlos a roles y usuarios, y verificar permisos.
 * Todas las rutas están protegidas por los middlewares de autenticación y rol de administrador.
 */
const express_1 = require("express");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const Permisos_controller_1 = require("./controllers/Permisos.controller");
const router = (0, express_1.Router)();
// Solo administradores pueden acceder a estas rutas
router.use(auth_middleware_1.authMiddleware);
router.use(rolesMiddleware_1.esAdministrador);
router.post('/', Permisos_controller_1.crearPermiso);
router.get('/', Permisos_controller_1.listarPermisos);
router.put('/rol/:rol', Permisos_controller_1.asignarPermisosARol);
router.put('/asignar-permisos/:id', Permisos_controller_1.asignarPermisosAUsuario);
router.get('/usuario/:id', Permisos_controller_1.obtenerPermisosUsuario);
router.get('/verificar-permiso/:id', Permisos_controller_1.verificarPermisoUsuario);
exports.default = router;
