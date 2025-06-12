"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/contratos.routes.ts
const express_1 = require("express");
const Contrato_controller_1 = require("./controllers/Contrato.controller");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const router = (0, express_1.Router)();
// Generar contrato PDF
router.post('/solicitudes-formales/:id/contrato', rolesMiddleware_1.esComerciante, // Solo comerciante puede generar
Contrato_controller_1.generarContratoPDF);
// Descargar contrato PDF
router.get('/solicitudes-formales/:id/contrato', rolesMiddleware_1.esComercianteOAnalista, // Ambos pueden descargar
Contrato_controller_1.descargarContratoPDF);
exports.default = router;
