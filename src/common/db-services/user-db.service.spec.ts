import { Test, TestingModule } from '@nestjs/testing';
import { UserDbService } from './user-db.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

describe('UserDbService', () => {
  let service: UserDbService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDbService,
        {
          provide: PrismaService,
          useValue: {
            userDb: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            roleDb: {
              findUnique: jest.fn(),
            },
            userProfileDb: {
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserDbService>(UserDbService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValue(mockUser as any);
      expect(await service.findById(1)).toEqual(mockUser);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create user with profile', async () => {
      const mockRole = { id: 2, name: 'user' };
      const mockUser = { id: 1, email: 'test@test.com' };
      
      jest.spyOn(prisma.roleDb, 'findUnique').mockResolvedValue(mockRole as any);
      jest.spyOn(prisma.userDb, 'create').mockResolvedValue(mockUser as any);

      const result = await service.createUser({ email: 'test@test.com', userUid: 'u1', firebaseUid: 'f1' }, 'user');
      
      expect(result).toEqual(mockUser);
      expect(prisma.roleDb.findUnique).toHaveBeenCalledWith({ where: { name: 'user' } });
      expect(prisma.userDb.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found', async () => {
      jest.spyOn(prisma.roleDb, 'findUnique').mockResolvedValue(null);
      await expect(service.createUser({ email: 'test@test.com' }, 'admin')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCustomers', () => {
    it('should return paginated customers', async () => {
      const mockUsers = [{ id: 1 }];
      jest.spyOn(prisma.userDb, 'findMany').mockResolvedValue(mockUsers as any);
      jest.spyOn(prisma.userDb, 'count').mockResolvedValue(1);

      const result = await service.getCustomers(1, 10);
      expect(result).toEqual({ data: mockUsers, total: 1 });
      expect(prisma.userDb.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { role: true, profile: true }
      });
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated user', async () => {
      const mockUser = { id: 1, email: 'updated@test.com' };
      jest.spyOn(prisma.userDb, 'update').mockResolvedValue({} as any);
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValue(mockUser as any); // for findById

      const result = await service.updateUser(1, { email: 'updated@test.com' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserProfile', () => {
    it('should create profile if none exists', async () => {
      const mockUser = { id: 1, profile: null };
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValueOnce(mockUser as any).mockResolvedValueOnce({ id: 1, profile: { firstName: 'John' } } as any);
      jest.spyOn(prisma.userProfileDb, 'create').mockResolvedValue({} as any);

      await service.updateUserProfile(1, { firstName: 'John' });
      expect(prisma.userProfileDb.create).toHaveBeenCalledWith({ data: { firstName: 'John', userId: 1 } });
    });

    it('should update profile if one exists', async () => {
      const mockUser = { id: 1, profile: { id: 1 } };
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValueOnce(mockUser as any).mockResolvedValueOnce(mockUser as any);
      jest.spyOn(prisma.userProfileDb, 'update').mockResolvedValue({} as any);

      await service.updateUserProfile(1, { firstName: 'Jane' });
      expect(prisma.userProfileDb.update).toHaveBeenCalledWith({
        where: { userId: 1 },
        data: { firstName: 'Jane' }
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.userDb, 'findUnique').mockResolvedValue(null);
      await expect(service.updateUserProfile(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should set isDeleted and isActive flags', async () => {
      jest.spyOn(prisma.userDb, 'update').mockResolvedValue({} as any);
      
      await service.deleteUser(1);
      
      expect(prisma.userDb.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ isDeleted: true, isActive: false, deletedAt: expect.any(Date) })
      });
    });
  });
});
