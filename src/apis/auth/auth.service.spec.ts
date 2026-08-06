import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDbService } from '@/common/db-services/user-db.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userDbService: UserDbService;
  let firebaseAuthGuard: FirebaseAuthGuard;
  let configService: ConfigService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserDbService,
          useValue: {
            findByFirebaseUid: jest.fn(),
            createUser: jest.fn(),
            updateUserProfile: jest.fn(),
          },
        },
        {
          provide: FirebaseAuthGuard,
          useValue: {
            verifyToken: jest.fn(),
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
    }).compile();

    service = module.get<AuthService>(AuthService);
    userDbService = module.get<UserDbService>(UserDbService);
    firebaseAuthGuard = module.get<FirebaseAuthGuard>(FirebaseAuthGuard);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fireBaseLogin', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      await expect(service.fireBaseLogin('')).rejects.toThrow(UnauthorizedException);
    });

    it('should login existing active user successfully', async () => {
      const decodedToken = { uid: 'f-uid', email: 'test@test.com' };
      const mockUser = { id: 1, status: UserStatus.ACTIVE };

      jest.spyOn(firebaseAuthGuard, 'verifyToken').mockResolvedValue(decodedToken as any);
      jest.spyOn(userDbService, 'findByFirebaseUid').mockResolvedValue(mockUser as any);

      const result = await service.fireBaseLogin('valid_token');
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if existing user is inactive', async () => {
      const decodedToken = { uid: 'f-uid', email: 'test@test.com' };
      const mockUser = { id: 1, status: UserStatus.INACTIVE };

      jest.spyOn(firebaseAuthGuard, 'verifyToken').mockResolvedValue(decodedToken as any);
      jest.spyOn(userDbService, 'findByFirebaseUid').mockResolvedValue(mockUser as any);

      await expect(service.fireBaseLogin('valid_token')).rejects.toThrow(UnauthorizedException);
    });

    it('should create new user if not found and assign admin role if email matches', async () => {
      const decodedToken = { uid: 'f-uid', email: 'admin@test.com', name: 'John Doe' };
      const mockUser = { id: 1, status: UserStatus.ACTIVE };

      jest.spyOn(firebaseAuthGuard, 'verifyToken').mockResolvedValue(decodedToken as any);
      jest.spyOn(userDbService, 'findByFirebaseUid').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue('admin@test.com');
      jest.spyOn(userDbService, 'createUser').mockResolvedValue(mockUser as any);
      cacheManager.store.keys = jest.fn().mockResolvedValue(['cache-key-1']);

      const result = await service.fireBaseLogin('valid_token');
      expect(result.success).toBe(true);
      expect(userDbService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'admin@test.com', firebaseUid: 'f-uid' }),
        'admin'
      );
      expect(cacheManager.del).toHaveBeenCalledWith('cache-key-1');
    });

    it('should create new user if not found and assign user role if email does not match', async () => {
      const decodedToken = { uid: 'f-uid', email: 'user@test.com', name: 'John Doe' };
      const mockUser = { id: 2, status: UserStatus.ACTIVE };

      jest.spyOn(firebaseAuthGuard, 'verifyToken').mockResolvedValue(decodedToken as any);
      jest.spyOn(userDbService, 'findByFirebaseUid').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue('admin@test.com');
      jest.spyOn(userDbService, 'createUser').mockResolvedValue(mockUser as any);

      await service.fireBaseLogin('valid_token');
      expect(userDbService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'user@test.com' }),
        'user'
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUser = { id: 1 };
      jest.spyOn(userDbService, 'updateUserProfile').mockResolvedValue(mockUser as any);

      const result = await service.updateProfile(1, { firstName: 'Jane' });
      expect(result.success).toBe(true);
      expect(userDbService.updateUserProfile).toHaveBeenCalledWith(1, { firstName: 'Jane' });
    });
  });
});
