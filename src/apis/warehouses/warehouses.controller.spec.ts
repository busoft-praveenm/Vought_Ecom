import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('WarehousesController', () => {
  let controller: WarehousesController;
  let service: WarehousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehousesController],
      providers: [
        {
          provide: WarehousesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getInventory: jest.fn(),
            setInventory: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WarehousesController>(WarehousesController);
    service = module.get<WarehousesService>(WarehousesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service findOne', async () => {
      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call service create', async () => {
      const dto = { name: 'W1', lat: 0, lng: 0 };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service update', async () => {
      const dto = { name: 'W2' };
      await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('should call service delete', async () => {
      await controller.delete('1');
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getInventory', () => {
    it('should call service getInventory', async () => {
      await controller.getInventory('1');
      expect(service.getInventory).toHaveBeenCalledWith(1);
    });
  });

  describe('setInventory', () => {
    it('should call service setInventory', async () => {
      await controller.setInventory('1', { productId: 1, quantity: 10 });
      expect(service.setInventory).toHaveBeenCalledWith(1, 1, 10);
    });
  });
});
