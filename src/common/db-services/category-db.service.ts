import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryDb } from "../entities/tbl_category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryDbService {
  constructor(
    @InjectRepository(CategoryDb)
    private readonly categoryRepo: Repository<CategoryDb>
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: CategoryDb[]; total: number }> {
    const [data, total] = await this.categoryRepo.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });
    return { data, total };
  }

  async getRandomCategories(limit: number = 6): Promise<CategoryDb[]> {
    return this.categoryRepo
      .createQueryBuilder('category')
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('RAND()')
      .take(limit)
      .getMany();
  }

  async findById(id: number): Promise<CategoryDb> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(name: string, description?: string, imageUrl?: string): Promise<CategoryDb> {
    const newCategory = this.categoryRepo.create({ name, description, imageUrl });
    return this.categoryRepo.save(newCategory);
  }

  async updateCategory(id: number, data: Partial<CategoryDb>): Promise<CategoryDb> {
    await this.categoryRepo.update(id, data);
    return this.findById(id);
  }
}
