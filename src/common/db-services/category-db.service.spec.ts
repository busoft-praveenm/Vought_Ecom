import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDbService } from './category-db.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoryDbService', () => {
  let service: CategoryDbService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryDbService,
        {
          provide: PrismaService,
          useValue: {
            categoryDb: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryDbService>(CategoryDbService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return categories and total count', async () => {
      const mockCategories = [{ id: 1, name: 'Electronics', isActive: true }];
      jest.spyOn(prisma.categoryDb, 'findMany').mockResolvedValue(mockCategories as any);
      jest.spyOn(prisma.categoryDb, 'count').mockResolvedValue(1);

      const result = await service.findAll(1, 10, false);
      expect(result).toEqual({ data: mockCategories, total: 1 });
      expect(prisma.categoryDb.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should query without isActive filter if admin', async () => {
      jest.spyOn(prisma.categoryDb, 'findMany').mockResolvedValue([]);
      jest.spyOn(prisma.categoryDb, 'count').mockResolvedValue(0);

      await service.findAll(1, 10, true);
      expect(prisma.categoryDb.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    });
  });

  describe('findById', () => {
    it('should return a category if found', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      jest.spyOn(prisma.categoryDb, 'findUnique').mockResolvedValue(mockCategory as any);

      const result = await service.findById(1);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.categoryDb, 'findUnique').mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCategory', () => {
    it('should create and return a category', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      jest.spyOn(prisma.categoryDb, 'create').mockResolvedValue(mockCategory as any);

      const result = await service.createCategory('Electronics', 'Desc', 'url');
      expect(result).toEqual(mockCategory);
      expect(prisma.categoryDb.create).toHaveBeenCalledWith({
        data: { name: 'Electronics', description: 'Desc', imageUrl: 'url' },
      });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      const mockCategory = { id: 1, name: 'Updated' };
      jest.spyOn(prisma.categoryDb, 'update').mockResolvedValue(mockCategory as any);
      jest.spyOn(service, 'findById').mockResolvedValue(mockCategory as any);

      const result = await service.updateCategory(1, { name: 'Updated' });
      expect(result).toEqual(mockCategory);
    });

    it('should throw BadRequestException if deactivating an exclusive category', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ product_id: 1 }]);
      await expect(service.updateCategory(1, { isActive: false })).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteCategory', () => {
    it('should soft delete category by setting isActive false and deletedAt', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([]);
      jest.spyOn(prisma.categoryDb, 'update').mockResolvedValue({} as any);

      await service.deleteCategory(1);
      expect(prisma.categoryDb.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({ isActive: false }),
        })
      );
    });

    it('should throw BadRequestException if category is exclusive for some products', async () => {
      jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ product_id: 1 }]);
      await expect(service.deleteCategory(1)).rejects.toThrow(BadRequestException);
    });
  });
});
