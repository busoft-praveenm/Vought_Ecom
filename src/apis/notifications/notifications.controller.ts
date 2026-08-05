import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import type { Request } from 'express';

@Controller('notifications')
@UseGuards(FirebaseAuthGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getNotifications(@Req() req: Request) {
    const user = req['dbUser'];
    
    const notifications = await this.prisma.notificationDb.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await this.prisma.notificationDb.count({
      where: { userId: user.id, isRead: false },
    });

    return {
      success: true,
      notifications,
      unreadCount,
    };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const user = req['dbUser'];
    
    if (id === 'all') {
      await this.prisma.notificationDb.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true },
      });
    } else {
      await this.prisma.notificationDb.update({
        where: { id: parseInt(id, 10), userId: user.id },
        data: { isRead: true },
      });
    }

    const unreadCount = await this.prisma.notificationDb.count({
      where: { userId: user.id, isRead: false },
    });

    return {
      success: true,
      unreadCount,
    };
  }
}
