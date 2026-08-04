import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BrandDb } from "@prisma/client";
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class BrandDbService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('cascade-deletion') private cascadeQueue: Queue
  ) {}

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const whereCondition = isAdmin ? {} : { isActive: true };
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      this.prisma.brandDb.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.brandDb.count({ where: whereCondition })
    ]);

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
    const brand = await this.prisma.brandDb.findFirst({ where: { id, isActive: true } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async getRandomBrands(limit: number = 6): Promise<BrandDb[]> {
    const activeBrands = await this.prisma.brandDb.findMany({
      where: { isActive: true }
    });
    
    // Shuffle array
    for (let i = activeBrands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeBrands[i], activeBrands[j]] = [activeBrands[j], activeBrands[i]];
    }

    return activeBrands.slice(0, limit);
  }

  async createBrand(name: string, description?: string, imageUrl?: string): Promise<BrandDb> {
    return this.prisma.brandDb.create({
      data: { name, description, imageUrl }
    });
  }

  async updateBrand(id: number, data: Partial<BrandDb>): Promise<BrandDb> {
    await this.prisma.brandDb.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return this.findById(id);
  }

  async deleteBrand(id: number): Promise<void> {
    await this.prisma.brandDb.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date()
      }
    });
    
    // Dispatch job to cascade soft delete to products
    await this.cascadeQueue.add('delete-products', { 
      entityType: 'brand', 
      entityId: id 
    });
  }
}
