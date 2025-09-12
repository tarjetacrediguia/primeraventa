"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/sistema.routes.ts
const express_1 = require("express");
const Sistema_controller_1 = require("./controllers/Sistema.controller");
const router = (0, express_1.Router)();
// Ruta pública sin autenticación
router.get('/version', Sistema_controller_1.getVersion);
exports.default = router;
