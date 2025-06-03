"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/index.ts
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const administradores_routes_1 = __importDefault(require("./administradores.routes"));
const rutasPV = (0, express_1.Router)();
rutasPV.use(auth_routes_1.default);
//router.use(comerciantesRoutes);
//router.use(analistasRoutes);
rutasPV.use(administradores_routes_1.default);
//router.use(permisosRoutes);
//router.use(solicitudesRoutes);
//router.use(contratosRoutes);
//router.use(estadisticasRoutes);
//router.use(notificacionesRoutes);
//router.use(configuracionRoutes);
//router.use(tareasRoutes);
//router.use(sistemaRoutes);
exports.default = rutasPV;
