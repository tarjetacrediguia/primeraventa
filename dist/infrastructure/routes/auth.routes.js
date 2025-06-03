"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/auth.routes.ts
const express_1 = require("express");
const Auth_controller_1 = require("./controllers/Auth.controller");
const router = (0, express_1.Router)();
router.post('/login', Auth_controller_1.login);
router.post('/logout', Auth_controller_1.logout);
router.post('/reset-password', Auth_controller_1.resetPassword); // Cambiado para usar token y nueva contraseña
exports.default = router;
