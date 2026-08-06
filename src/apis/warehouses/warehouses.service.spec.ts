import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        {
          provide: PrismaService,
          useValue: {
            warehouseDb: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            warehouseProductDb: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            productsDb: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return warehouses', async () => {
      const mock = [{ id: 1 }];
      jest.spyOn(prisma.warehouseDb, 'findMany').mockResolvedValue(mock as any);
      expect(await service.findAll()).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse', async () => {
      const mock = { id: 1 };
      jest.spyOn(prisma.warehouseDb, 'findUnique').mockResolvedValue(mock as any);
      expect(await service.findOne(1)).toEqual(mock);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(prisma.warehouseDb, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create warehouse', async () => {
      const mock = { id: 1 };
      jest.spyOn(prisma.warehouseDb, 'create').mockResolvedValue(mock as any);
      expect(await service.create({ name: 'W1', lat: 0, lng: 0 } as any)).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update warehouse', async () => {
      const mock = { id: 1 };
      jest.spyOn(prisma.warehouseDb, 'update').mockResolvedValue({} as any);
      jest.spyOn(prisma.warehouseDb, 'findUnique').mockResolvedValue(mock as any);
      expect(await service.update(1, { name: 'W2' } as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete warehouse', async () => {
      jest.spyOn(prisma.warehouseDb, 'delete').mockResolvedValue({} as any);
      expect(await service.delete(1)).toEqual({ success: true });
    });
  });

  describe('setInventory', () => {
    it('should update existing inventory and aggregate stock', async () => {
      const mockWp = { id: 1, warehouseId: 1, productId: 1, quantity: 5 };
      jest.spyOn(prisma.warehouseProductDb, 'findFirst').mockResolvedValue(mockWp as any);
      jest.spyOn(prisma.warehouseProductDb, 'update').mockResolvedValue({ ...mockWp, quantity: 10 } as any);
      jest.spyOn(prisma.warehouseProductDb, 'findMany').mockResolvedValue([{ quantity: 10 } as any]);
      jest.spyOn(prisma.productsDb, 'update').mockResolvedValue({} as any);

      await service.setInventory(1, 1, 10);
      expect(prisma.warehouseProductDb.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ quantity: 10 }) })
      );
      expect(prisma.productsDb.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { stock: 10 } })
      );
    });

    it('should create new inventory and aggregate stock', async () => {
      jest.spyOn(prisma.warehouseProductDb, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prisma.warehouseProductDb, 'create').mockResolvedValue({ id: 1, quantity: 5 } as any);
      jest.spyOn(prisma.warehouseProductDb, 'findMany').mockResolvedValue([{ quantity: 5 } as any]);
      jest.spyOn(prisma.productsDb, 'update').mockResolvedValue({} as any);

      await service.setInventory(1, 1, 5);
      expect(prisma.warehouseProductDb.create).toHaveBeenCalled();
      expect(prisma.productsDb.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { stock: 5 } })
      );
    });
  });
});
