import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notificationsQueue') private notificationsQueue: Queue,
  ) {}

  async notifyUser(userId: number, title: string, message: string) {
    try {
      await this.notificationsQueue.add('sendNotification', {
        userId,
        title,
        message,
      });
    } catch (error) {
      // Catch and log the error silently so it NEVER interrupts the main API flow
      this.logger.error(`Failed to enqueue notification for user ${userId}`, error);
    }
  }
}
