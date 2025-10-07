//src/infrastructure/routes/controllers/Notificaciones.controller.ts
import { Request, Response } from 'express';
import { NotificationAdapter } from '../../adapters/notification/NotificationAdapter';
import { GetNotificationsByUserIdUseCase } from '../../../application/use-cases/Notificacion/GetNotificationsByUserIdUseCase';
import { MarkNotificationAsReadUseCase } from '../../../application/use-cases/Notificacion/MarkNotificationAsReadUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../../application/use-cases/Notificacion/MarkAllNotificationsAsReadUseCase';

const notificationAdapter = new NotificationAdapter();

/**
 * CONTROLADOR: Notificaciones
 *
 * Este archivo contiene los controladores para la gestión de notificaciones en el sistema.
 * Permite obtener y crear notificaciones para los usuarios.
 * Cada función está diseñada para ser utilizada como handler de rutas Express.
 */

/**
 * Obtiene las notificaciones de un usuario autenticado.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un array de notificaciones o un error en caso de fallo.
 */
export const getNotifications = async (req: Request, res: Response) => {
    try {
        // Obtener el ID del usuario autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const userId = Number(req.user.id);
        const role = req.user.rol;
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

/**
 * Marca todas las notificaciones del usuario autenticado como leídas.
 * @param req - Request de Express con el usuario autenticado.
 * @param res - Response de Express para enviar la respuesta.
 * @returns Devuelve un mensaje de éxito o un error en caso de fallo.
 */
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
    try {
        // Obtener el ID del usuario autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const userId = Number(req.user.id);
        
        const useCase = new MarkAllNotificationsAsReadUseCase(notificationAdapter);
        await useCase.execute(userId);
        
        res.status(200).json({ 
            message: 'Todas las notificaciones han sido marcadas como leídas',
            userId: userId
        });
    } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
