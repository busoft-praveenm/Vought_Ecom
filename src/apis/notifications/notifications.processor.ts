import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('notificationsQueue')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, title, message } = job.data;
    
    try {
      // 1. Save to DB
      const notification = await this.prisma.notificationDb.create({
        data: {
          userId,
          title,
          message,
          isRead: false,
        },
      });

      // 2. Count unread
      const unreadCount = await this.prisma.notificationDb.count({
        where: { userId, isRead: false },
      });

      // 3. Emit via Gateway
      this.gateway.emitToUser(userId, 'notification', {
        notification,
        unreadCount,
      });

      this.logger.log(`Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to process notification for user ${userId}`, error);
      throw error;
    }
  }
}
