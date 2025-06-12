//src/infrastructure/routes/notification.routes.ts

import { Router } from 'express';
import { getNotifications, markNotificationAsRead } from './controllers/Notificaciones.controller';

const router = Router();

// Obtener notificaciones del usuario
router.get('/', getNotifications);

// Marcar notificación como leída
router.put('/:id/leida', markNotificationAsRead);

export default router;