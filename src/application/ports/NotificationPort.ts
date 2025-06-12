// src/application/ports/NotificationPort.ts

export interface Notification {
    id: number;
    userId: number;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
    metadata?: any;
}

export interface NotificationPort {
    emitNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification>;
    getNotificationsByUserId(userId: number): Promise<Notification[]>;
    deleteNotification(id: number): Promise<void>;
    markNotificationAsRead(id: number): Promise<void>;
    markAllNotificationsAsRead(userId: number): Promise<void>;
    getUnreadNotificationsCount(userId: number): Promise<number>;
    getNotificationsByType(userId: number, type: string): Promise<Notification[]>;
    
}