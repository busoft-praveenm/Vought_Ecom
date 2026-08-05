import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let queueMock: any;

  beforeEach(async () => {
    queueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getQueueToken('notificationsQueue'),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notifyUser', () => {
    it('should add a job to the notifications queue', async () => {
      await service.notifyUser(1, 'Test Title', 'Test Message');
      expect(queueMock.add).toHaveBeenCalledWith('sendNotification', {
        userId: 1,
        title: 'Test Title',
        message: 'Test Message',
      });
    });

    it('should silently handle errors if queue fails', async () => {
      queueMock.add.mockRejectedValue(new Error('Redis connection failed'));
      
      // Should not throw
      await expect(service.notifyUser(1, 'Test Title', 'Test Message')).resolves.not.toThrow();
    });
  });
});
