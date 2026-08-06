import { Test, TestingModule } from '@nestjs/testing';
import { BrandDbService } from './brand-db.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';

describe('BrandDbService', () => {
  let service: BrandDbService;
  let prisma: PrismaService;
  let queueMock: { add: jest.Mock };

  beforeEach(async () => {
    queueMock = { add: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandDbService,
        {
          provide: PrismaService,
          useValue: {
            brandDb: {
              findMany: jest.fn(),
              count: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: getQueueToken('cascade-deletion'),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<BrandDbService>(BrandDbService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return brands and pagination', async () => {
      const mockBrands = [{ id: 1, name: 'Nike', isActive: true }];
      jest.spyOn(prisma.brandDb, 'findMany').mockResolvedValue(mockBrands as any);
      jest.spyOn(prisma.brandDb, 'count').mockResolvedValue(1);

      const result = await service.findAll(1, 10, false);
      expect(result).toEqual({
        results: mockBrands,
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
      expect(prisma.brandDb.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should query without isActive filter if admin', async () => {
      jest.spyOn(prisma.brandDb, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.brandDb, 'count').mockResolvedValue(0);

      await service.findAll(1, 10, true);
      expect(prisma.brandDb.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });
  });

  describe('findById', () => {
    it('should return a brand if found', async () => {
      const mockBrand = { id: 1, name: 'Nike' };
      jest.spyOn(prisma.brandDb, 'findFirst').mockResolvedValue(mockBrand as any);

      const result = await service.findById(1);
      expect(result).toEqual(mockBrand);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.brandDb, 'findFirst').mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBrand', () => {
    it('should create and return a brand', async () => {
      const mockBrand = { id: 1, name: 'Nike' };
      jest.spyOn(prisma.brandDb, 'create').mockResolvedValue(mockBrand as any);

      const result = await service.createBrand('Nike', 'Desc', 'url');
      expect(result).toEqual(mockBrand);
      expect(prisma.brandDb.create).toHaveBeenCalledWith({
        data: { name: 'Nike', description: 'Desc', imageUrl: 'url' },
      });
    });
  });

  describe('updateBrand', () => {
    it('should update and return the brand', async () => {
      const mockBrand = { id: 1, name: 'Updated' };
      jest.spyOn(prisma.brandDb, 'update').mockResolvedValue(mockBrand as any);
      jest.spyOn(prisma.brandDb, 'findFirst').mockResolvedValue(mockBrand as any); // because updateBrand calls findById

      const result = await service.updateBrand(1, { name: 'Updated' });
      expect(result).toEqual(mockBrand);
      expect(prisma.brandDb.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 }, data: expect.objectContaining({ name: 'Updated' }) })
      );
    });
  });

  describe('deleteBrand', () => {
    it('should soft delete brand and queue cascade deletion', async () => {
      jest.spyOn(prisma.brandDb, 'update').mockResolvedValue({} as any);

      await service.deleteBrand(1);
      expect(prisma.brandDb.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({ isActive: false, deletedAt: expect.any(Date) }),
        })
      );
      expect(queueMock.add).toHaveBeenCalledWith('delete-products', { entityType: 'brand', entityId: 1 });
    });
  });
});
