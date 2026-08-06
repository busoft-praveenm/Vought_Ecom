import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsProcessor } from './notifications.processor';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { Job } from 'bullmq';

describe('NotificationsProcessor', () => {
  let processor: NotificationsProcessor;
  let gatewayMock: any;
  let prismaMock: any;

  beforeEach(async () => {
    gatewayMock = {
      emitToUser: jest.fn(),
    };

    prismaMock = {
      notificationDb: {
        create: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsProcessor,
        {
          provide: NotificationsGateway,
          useValue: gatewayMock,
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    processor = module.get<NotificationsProcessor>(NotificationsProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should save notification and emit to user', async () => {
      const mockJob = {
        data: {
          userId: 1,
          title: 'Test Title',
          message: 'Test Message',
        },
      } as Job<any, any, string>;

      const mockNotification = {
        id: 1,
        userId: 1,
        title: 'Test Title',
        message: 'Test Message',
        isRead: false,
      };

      prismaMock.notificationDb.create.mockResolvedValue(mockNotification);
      prismaMock.notificationDb.count.mockResolvedValue(5);

      await processor.process(mockJob);

      expect(prismaMock.notificationDb.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          title: 'Test Title',
          message: 'Test Message',
          isRead: false,
        },
      });

      expect(prismaMock.notificationDb.count).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
      });

      expect(gatewayMock.emitToUser).toHaveBeenCalledWith(1, 'notification', {
        notification: mockNotification,
        unreadCount: 5,
      });
    });

    it('should bubble up error if database fails', async () => {
      const mockJob = {
        data: {
          userId: 1,
          title: 'Test Title',
          message: 'Test Message',
        },
      } as Job<any, any, string>;

      prismaMock.notificationDb.create.mockRejectedValue(new Error('DB Error'));

      await expect(processor.process(mockJob)).rejects.toThrow('DB Error');
    });
  });
});
