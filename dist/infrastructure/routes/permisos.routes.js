"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/permisos.routes.ts
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
exports.default = router;
