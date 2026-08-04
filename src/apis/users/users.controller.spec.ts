import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserDbService } from '@/common/db-services/user-db.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { BadRequestException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UserDbService;
  let configService: ConfigService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserDbService,
          useValue: {
            getCustomers: jest.fn(),
            findById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            del: jest.fn(),
            store: { keys: jest.fn().mockResolvedValue([]) }
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UserDbService>(UserDbService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCustomers', () => {
    it('should call getCustomers on service', async () => {
      jest.spyOn(service, 'getCustomers').mockResolvedValue({ data: [], total: 0 });
      await controller.getCustomers('1', '10');
      expect(service.getCustomers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('updateUserStatus', () => {
    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null as any);
      await expect(controller.updateUserStatus('1', { status: UserStatus.INACTIVE })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if trying to deactivate admin', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, email: 'admin@test.com' } as any);
      jest.spyOn(configService, 'get').mockReturnValue('admin@test.com');
      
      await expect(controller.updateUserStatus('1', { status: UserStatus.INACTIVE })).rejects.toThrow(BadRequestException);
    });

    it('should update user status and clear cache', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue({ id: 1, email: 'user@test.com' } as any);
      jest.spyOn(configService, 'get').mockReturnValue('admin@test.com');
      jest.spyOn(service, 'updateUser').mockResolvedValue({ id: 1, status: UserStatus.INACTIVE } as any);
      
      // Setup cache mock properly
      cacheManager.store.keys = jest.fn().mockResolvedValue(['cache-key-1']);
      
      const result = await controller.updateUserStatus('1', { status: UserStatus.INACTIVE });
      
      expect(result).toEqual({ id: 1, status: UserStatus.INACTIVE });
      expect(service.updateUser).toHaveBeenCalledWith(1, { status: UserStatus.INACTIVE });
      expect(cacheManager.del).toHaveBeenCalledWith('cache-key-1');
    });
  });
});
