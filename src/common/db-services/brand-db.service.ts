import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BrandDb } from "../entities/tbl_brand.entity";

@Injectable()
export class BrandDbService {
  constructor(
    @InjectRepository(BrandDb)
    private readonly brandRepo: Repository<BrandDb>
  ) {}

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const queryBuilder = this.brandRepo.createQueryBuilder('brand')
      .orderBy('brand.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (!isAdmin) {
      queryBuilder.where('brand.isActive = :isActive', { isActive: true });
    }

    const [brands, total] = await queryBuilder.getManyAndCount();

    return {
      results: brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<BrandDb> {
    const brand = await this.brandRepo.findOne({ where: { id, isActive: true } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async createBrand(name: string, description?: string, imageUrl?: string): Promise<BrandDb> {
    const newBrand = this.brandRepo.create({ name, description, imageUrl });
    return this.brandRepo.save(newBrand);
  }

  async updateBrand(id: number, data: Partial<BrandDb>): Promise<BrandDb> {
    await this.brandRepo.update(id, data);
    return this.findById(id);
  }

  async deleteBrand(id: number): Promise<void> {
    await this.brandRepo.softDelete(id);
    
    // Cascade soft delete to products
    await this.brandRepo.manager
      .createQueryBuilder()
      .update('tbl_products')
      .set({ isDeleted: true })
      .where('brand_id = :id', { id })
      .execute();
  }
}
