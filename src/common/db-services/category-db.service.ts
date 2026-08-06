import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CategoryDb } from "@prisma/client";

@Injectable()
export class CategoryDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, isAdmin = false) {
    const whereCondition = isAdmin ? {} : { isActive: true };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.categoryDb.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.categoryDb.count({ where: whereCondition })
    ]);

    return { data, total };
  }

  async getRandomCategories(limit: number = 6): Promise<CategoryDb[]> {
    // Prisma does not have a native ORDER BY RAND().
    // Fetch all active categories and pick randomly in memory, or use $queryRaw.
    const activeCategories = await this.prisma.categoryDb.findMany({
      where: { isActive: true }
    });
    
    // Shuffle array
    for (let i = activeCategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeCategories[i], activeCategories[j]] = [activeCategories[j], activeCategories[i]];
    }

    return activeCategories.slice(0, limit);
  }

  async findById(id: number): Promise<CategoryDb> {
    const category = await this.prisma.categoryDb.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(name: string, description?: string, imageUrl?: string): Promise<CategoryDb> {
    return this.prisma.categoryDb.create({
      data: { name, description, imageUrl }
    });
  }

  async updateCategory(id: number, data: Partial<CategoryDb>): Promise<CategoryDb> {
    if (data.isActive === false) {
      const conflictingProducts: { B: number }[] = await this.prisma.$queryRaw`
        SELECT pc.B 
        FROM _product_categories pc 
        JOIN (
          SELECT B 
          FROM _product_categories 
          GROUP BY B 
          HAVING COUNT(A) = 1
        ) single_cat_products ON pc.B = single_cat_products.B
        WHERE pc.A = ${id}
      `;
      if (conflictingProducts.length > 0) {
        throw new BadRequestException('Cannot deactivate category because it is the only category for some products.');
      }
    }
    await this.prisma.categoryDb.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return this.findById(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const conflictingProducts: { B: number }[] = await this.prisma.$queryRaw`
      SELECT pc.B 
      FROM _product_categories pc 
      JOIN (
        SELECT B 
        FROM _product_categories 
        GROUP BY B 
        HAVING COUNT(A) = 1
      ) single_cat_products ON pc.B = single_cat_products.B
      WHERE pc.A = ${id}
    `;
    if (conflictingProducts.length > 0) {
      throw new BadRequestException('Cannot delete category because it is the only category for some products.');
    }
    await this.prisma.categoryDb.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date()
      }
    });
  }
}
