//src/apolication/use-cases/Notificacion/MarkNotificationAsReadUseCase.ts

import { NotificationPort } from "../../../application/ports/NotificationPort";

export class MarkNotificationAsReadUseCase {
    constructor(private readonly notificationPort: NotificationPort) {}

    async execute(notificationId: number): Promise<void> {
        return this.notificationPort.markNotificationAsRead(notificationId);
    }
}