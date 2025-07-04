//src/application/use-cases/Notificacion/GetNotificationsByUserIdUseCase.ts
import { NotificationPort } from "../../../application/ports/NotificationPort";

export class GetNotificationsByUserIdUseCase {
    constructor(private readonly notificationPort: NotificationPort) {}

    async execute(userId: number): Promise<any[]> {
        return this.notificationPort.getNotificationsByUserId(userId);
    }
}
