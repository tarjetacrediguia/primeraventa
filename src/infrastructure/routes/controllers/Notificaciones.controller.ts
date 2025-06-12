//src/infrastructure/routes/controllers/Notificaciones.controller.ts
import { Request, Response } from 'express';
import { NotificationAdapter } from '../../adapters/notification/NotificationAdapter';
import { GetNotificationsByUserIdUseCase } from '../../../application/use-cases/Notificacion/GetNotificationsByUserIdUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/use-cases/Notificacion/MarkNotificationAsReadUseCase';

const notificationAdapter = new NotificationAdapter();

export const getNotifications = async (req: Request, res: Response) => {
    try {
        // Obtener el ID del usuario autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const userId = Number(req.user.id);
        console.log('ID del usuario autenticado:', userId);
        const role = req.user.rol;
        console.log('Rol del usuario autenticado:', role);
        const useCase = new GetNotificationsByUserIdUseCase(notificationAdapter);
        const notifications = await useCase.execute(userId);
        
        // Convertir a objetos planos
        const plainNotifications = notifications.map(notification => 
            notification instanceof Object && 'toPlainObject' in notification 
                ? notification.toPlainObject() 
                : notification
        );
        
        res.status(200).json(plainNotifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
    try {
        const notificationId = Number(req.params.id);
        
        const useCase = new MarkNotificationAsReadUseCase(notificationAdapter);
        await useCase.execute(notificationId);
        
        res.status(200).json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error al marcar notificación:', error);
        
        if ((error as Error).message.includes('no encontrada')) {
            res.status(404).json({ error: 'Notificación no encontrada' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};