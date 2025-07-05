//src/infrastructure/routes/notification.routes.ts

/**
 * RUTAS: Notificaciones
 *
 * Este archivo define las rutas para la gestión de notificaciones de los usuarios.
 * Permite obtener las notificaciones y marcarlas como leídas.
 */

import { Router } from 'express';
import { getNotifications, markNotificationAsRead } from './controllers/Notificaciones.controller';

const router = Router();

// Obtener notificaciones del usuario
router.get('/', getNotifications);

// Marcar notificación como leída
router.put('/:id/leida', markNotificationAsRead);

export default router;
