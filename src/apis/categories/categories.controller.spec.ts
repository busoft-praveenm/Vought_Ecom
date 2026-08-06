import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoryDbService } from '@/common/db-services/category-db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoryDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoryDbService,
          useValue: {
            findAll: jest.fn(),
            getRandomCategories: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoryDbService>(CategoryDbService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should call findAll with page, limit', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({ data: [], total: 0 });
      await controller.getCategories('1', '10');
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getRandomCategories', () => {
    it('should call getRandomCategories with limit', async () => {
      jest.spyOn(service, 'getRandomCategories').mockResolvedValue([]);
      await controller.getRandomCategories('5');
      expect(service.getRandomCategories).toHaveBeenCalledWith(5);
    });
  });

  describe('getCategoriesAdmin', () => {
    it('should call findAll with page, limit, and isAdmin=true', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue({ data: [], total: 0 });
      await controller.getCategoriesAdmin('2', '20');
      expect(service.findAll).toHaveBeenCalledWith(2, 20, true);
    });
  });

  describe('createCategory', () => {
    it('should call createCategory on service', async () => {
      const dto: CreateCategoryDto = { name: 'Test', description: 'Desc' };
      jest.spyOn(service, 'createCategory').mockResolvedValue({} as any);
      await controller.createCategory(dto);
      expect(service.createCategory).toHaveBeenCalledWith(dto.name, dto.description, undefined);
    });
  });

  describe('updateCategory', () => {
    it('should call updateCategory on service', async () => {
      const dto: UpdateCategoryDto = { name: 'Updated' };
      jest.spyOn(service, 'updateCategory').mockResolvedValue({} as any);
      await controller.updateCategory('1', dto);
      expect(service.updateCategory).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteCategory', () => {
    it('should call deleteCategory on service', async () => {
      jest.spyOn(service, 'deleteCategory').mockResolvedValue();
      await controller.deleteCategory('1');
      expect(service.deleteCategory).toHaveBeenCalledWith(1);
    });
  });
});
