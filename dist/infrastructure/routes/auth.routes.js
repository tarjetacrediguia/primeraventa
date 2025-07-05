"use strict";
// src/infrastructure/routes/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Autenticación
 *
 * Este archivo define las rutas para la autenticación de usuarios en el sistema.
 * Permite el login, logout y el restablecimiento de contraseña.
 * Estas rutas son públicas y no requieren autenticación previa.
 */
const express_1 = require("express");
const Auth_controller_1 = require("./controllers/Auth.controller");
const router = (0, express_1.Router)();
router.post('/login', Auth_controller_1.login);
router.post('/logout', Auth_controller_1.logout);
router.post('/reset-password', Auth_controller_1.resetPassword); // Cambiado para usar token y nueva contraseña
exports.default = router;
