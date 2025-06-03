"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../routes/middlewares/auth.middleware");
const Comerciantes_controller_1 = require("./controllers/Comerciantes.controller");
const router = (0, express_1.Router)();
// Rutas protegidas que requieren autenticación
router.post('/', auth_middleware_1.authMiddleware, Comerciantes_controller_1.createComerciante);
router.put('/:id', auth_middleware_1.authMiddleware, Comerciantes_controller_1.updateComerciante);
router.delete('/:id', auth_middleware_1.authMiddleware, Comerciantes_controller_1.deleteComerciante);
router.get('/:id', auth_middleware_1.authMiddleware, Comerciantes_controller_1.getComerciante);
router.get('/', auth_middleware_1.authMiddleware, Comerciantes_controller_1.listComerciantes);
exports.default = router;
