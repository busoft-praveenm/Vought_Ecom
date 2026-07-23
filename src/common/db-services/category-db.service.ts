import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryDb } from "../entities/tbl_category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryDbService {
  constructor(
    @InjectRepository(CategoryDb)
    private readonly categoryRepo: Repository<CategoryDb>
  ) {}

  async findAll(page: number = 1, limit: number = 10, isAdmin = false): Promise<{ data: CategoryDb[]; total: number }> {
    const whereCondition = isAdmin ? {} : { isActive: true };
    const [data, total] = await this.categoryRepo.findAndCount({
      where: whereCondition,
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
    if (data.isActive === false) {
      const conflictingProducts = await this.categoryRepo.manager.query(
        `SELECT pc.product_id 
         FROM product_categories pc 
         JOIN (
           SELECT product_id 
           FROM product_categories 
           GROUP BY product_id 
           HAVING COUNT(category_id) = 1
         ) single_cat_products ON pc.product_id = single_cat_products.product_id
         WHERE pc.category_id = ?`,
         [id]
      );
      if (conflictingProducts.length > 0) {
        throw new BadRequestException('Cannot deactivate category because it is the only category for some products.');
      }
    }
    await this.categoryRepo.update(id, data);
    return this.findById(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const conflictingProducts = await this.categoryRepo.manager.query(
      `SELECT pc.product_id 
       FROM product_categories pc 
       JOIN (
         SELECT product_id 
         FROM product_categories 
         GROUP BY product_id 
         HAVING COUNT(category_id) = 1
       ) single_cat_products ON pc.product_id = single_cat_products.product_id
       WHERE pc.category_id = ?`,
       [id]
    );
    if (conflictingProducts.length > 0) {
      throw new BadRequestException('Cannot delete category because it is the only category for some products.');
    }
    await this.categoryRepo.softDelete(id);
  }
}
