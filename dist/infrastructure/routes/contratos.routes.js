"use strict";
// src/infrastructure/routes/contratos.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Contratos
 *
 * Este archivo define las rutas para la generación y descarga de contratos en formato PDF.
 * Permite a los comerciantes generar contratos y a comerciantes o analistas descargarlos.
 * Todas las rutas están protegidas por los middlewares de roles correspondientes.
 */
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
