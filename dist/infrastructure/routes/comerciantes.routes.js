"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Comerciantes_controller_1 = require("./controllers/Comerciantes.controller");
const rolesMiddleware_1 = require("./middlewares/rolesMiddleware");
const router = (0, express_1.Router)();
// Rutas protegidas que requieren autenticación
router.post('/', rolesMiddleware_1.esComercianteOAnalista, Comerciantes_controller_1.createComerciante);
router.put('/:id', rolesMiddleware_1.esComercianteOAnalista, Comerciantes_controller_1.updateComerciante);
router.delete('/:id', rolesMiddleware_1.esComercianteOAnalista, Comerciantes_controller_1.deleteComerciante);
router.get('/:id', rolesMiddleware_1.esComercianteOAnalista, Comerciantes_controller_1.getComerciante);
router.get('/', rolesMiddleware_1.esComercianteOAnalista, Comerciantes_controller_1.listComerciantes);
exports.default = router;
