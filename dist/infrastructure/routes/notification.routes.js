"use strict";
//src/infrastructure/routes/notification.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RUTAS: Notificaciones
 *
 * Este archivo define las rutas para la gestión de notificaciones de los usuarios.
 * Permite obtener las notificaciones y marcarlas como leídas.
 */
const express_1 = require("express");
const Notificaciones_controller_1 = require("./controllers/Notificaciones.controller");
const router = (0, express_1.Router)();
// Obtener notificaciones del usuario
router.get('/', Notificaciones_controller_1.getNotifications);
// Marcar notificación como leída
router.put('/:id/leida', Notificaciones_controller_1.markNotificationAsRead);
exports.default = router;
