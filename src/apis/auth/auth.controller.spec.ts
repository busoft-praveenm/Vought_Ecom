import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            fireBaseLogin: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('firebaseLogin', () => {
    it('should call firebaseLogin and set cookie on response', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      jest.spyOn(service, 'fireBaseLogin').mockResolvedValue({ user: mockUser });

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.firebaseLogin('Bearer valid_token', mockResponse, {} as any);

      expect(service.fireBaseLogin).toHaveBeenCalledWith('valid_token', {});
      expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'valid_token', expect.any(Object));
      expect(result).toEqual({ message: 'Login Success', user: mockUser });
    });
  });

  describe('logout', () => {
    it('should clear cookie', async () => {
      const mockRequest = {} as unknown as Request;
      const mockResponse = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.logout(mockRequest, mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('access_token', expect.any(Object));
      expect(result).toEqual({ message: 'Logout Success' });
    });
  });

  describe('getMe', () => {
    it('should return user from request object', async () => {
      const mockRequest = { dbUser: { id: 1, email: 'test@test.com' } } as unknown as Request;

      const result = await controller.getMe(mockRequest);

      expect(result).toEqual({ message: 'Success', user: { id: 1, email: 'test@test.com' } });
    });
  });

  describe('updateProfile', () => {
    it('should call updateProfile on service with user id from request', async () => {
      const mockRequest = { dbUser: { id: 1 } } as unknown as Request;
      jest.spyOn(service, 'updateProfile').mockResolvedValue({ success: true } as any);

      const result = await controller.updateProfile(mockRequest, { firstName: 'John' });

      expect(service.updateProfile).toHaveBeenCalledWith(1, { firstName: 'John' });
      expect(result).toEqual({ success: true });
    });
  });
});
