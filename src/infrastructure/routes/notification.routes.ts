//src/infrastructure/routes/notification.routes.ts

/**
 * RUTAS: Notificaciones
 *
 * Este archivo define las rutas para la gestión de notificaciones de los usuarios.
 * Permite obtener las notificaciones y marcarlas como leídas.
 */

import { Router } from 'express';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from './controllers/Notificaciones.controller';

const router = Router();

// Obtener notificaciones del usuario
router.get('/', getNotifications);

// Marcar notificación como leída
router.put('/:id/leida', markNotificationAsRead);

// Marcar TODAS las notificaciones del usuario como leídas
router.put('/leer-todas', markAllNotificationsAsRead);

export default router;
