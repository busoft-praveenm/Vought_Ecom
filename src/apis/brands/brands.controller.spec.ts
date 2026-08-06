import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandDbService } from '@/common/db-services/brand-db.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandDbService,
          useValue: {
            findAll: jest.fn(),
            getRandomBrands: jest.fn(),
            createBrand: jest.fn(),
            updateBrand: jest.fn(),
            deleteBrand: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandDbService>(BrandDbService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBrands', () => {
    it('should call findAll with page, limit', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({ results: [], pagination: {} } as any);
      await controller.getBrands('1', '10');
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getRandomBrands', () => {
    it('should call getRandomBrands with limit', async () => {
      jest.spyOn(service, 'getRandomBrands').mockResolvedValue([]);
      await controller.getRandomBrands('5');
      expect(service.getRandomBrands).toHaveBeenCalledWith(5);
    });
  });

  describe('getBrandsAdmin', () => {
    it('should call findAll with page, limit, and isAdmin=true', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({ results: [], pagination: {} } as any);
      await controller.getBrandsAdmin('2', '20');
      expect(service.findAll).toHaveBeenCalledWith(2, 20, true);
    });
  });

  describe('createBrand', () => {
    it('should call createBrand on service', async () => {
      const dto: CreateBrandDto = { name: 'Test', description: 'Desc' };
      jest.spyOn(service, 'createBrand').mockResolvedValue({} as any);
      await controller.createBrand(dto);
      expect(service.createBrand).toHaveBeenCalledWith(dto.name, dto.description, undefined);
    });
  });

  describe('updateBrand', () => {
    it('should call updateBrand on service', async () => {
      const dto: UpdateBrandDto = { name: 'Updated' };
      jest.spyOn(service, 'updateBrand').mockResolvedValue({} as any);
      await controller.updateBrand('1', dto);
      expect(service.updateBrand).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteBrand', () => {
    it('should call deleteBrand on service', async () => {
      jest.spyOn(service, 'deleteBrand').mockResolvedValue();
      await controller.deleteBrand('1');
      expect(service.deleteBrand).toHaveBeenCalledWith(1);
    });
  });
});
