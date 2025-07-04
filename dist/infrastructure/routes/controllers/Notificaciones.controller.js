"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationAsRead = exports.getNotifications = void 0;
const NotificationAdapter_1 = require("../../adapters/notification/NotificationAdapter");
const GetNotificationsByUserIdUseCase_1 = require("../../../application/use-cases/Notificacion/GetNotificationsByUserIdUseCase");
const MarkNotificationAsReadUseCase_1 = require("../../../application/use-cases/Notificacion/MarkNotificationAsReadUseCase");
const notificationAdapter = new NotificationAdapter_1.NotificationAdapter();
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el ID del usuario autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        const userId = Number(req.user.id);
        const role = req.user.rol;
        const useCase = new GetNotificationsByUserIdUseCase_1.GetNotificationsByUserIdUseCase(notificationAdapter);
        const notifications = yield useCase.execute(userId);
        // Convertir a objetos planos
        const plainNotifications = notifications.map(notification => notification instanceof Object && 'toPlainObject' in notification
            ? notification.toPlainObject()
            : notification);
        res.status(200).json(plainNotifications);
    }
    catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getNotifications = getNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationId = Number(req.params.id);
        const useCase = new MarkNotificationAsReadUseCase_1.MarkNotificationAsReadUseCase(notificationAdapter);
        yield useCase.execute(notificationId);
        res.status(200).json({ message: 'Notificación marcada como leída' });
    }
    catch (error) {
        console.error('Error al marcar notificación:', error);
        if (error.message.includes('no encontrada')) {
            res.status(404).json({ error: 'Notificación no encontrada' });
        }
        else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
