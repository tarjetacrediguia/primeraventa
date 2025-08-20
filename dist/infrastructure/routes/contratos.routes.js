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
// Generar contrato PDF y descargarlo directamente
router.post('/compra/:id/contrato-descarga', rolesMiddleware_1.esComercianteOAnalista, // Solo comerciante puede generar
Contrato_controller_1.generarYDescargarContratoPDF);
exports.default = router;
