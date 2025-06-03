// src/application/ports/NotificationPort.ts

export interface Notification {
    id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
    metadata?: any;
}

export interface NotificationPort {
    emitNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification>;
    getNotificationsByUserId(userId: string): Promise<Notification[]>;
    deleteNotification(id: string): Promise<void>;
    markNotificationAsRead(id: string): Promise<void>;
    markAllNotificationsAsRead(userId: string): Promise<void>;
    getUnreadNotificationsCount(userId: string): Promise<number>;
    getNotificationsByType(userId: string, type: string): Promise<Notification[]>;
}