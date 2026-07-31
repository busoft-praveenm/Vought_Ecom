import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WarehouseDb } from '@prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.warehouseDb.findMany();
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouseDb.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async create(data: Partial<WarehouseDb>) {
    return this.prisma.warehouseDb.create({
      data: {
        name: data.name!,
        address: data.address,
        lat: data.lat!,
        lng: data.lng!,
        processingTimeHours: data.processingTimeHours ?? 24,
        isActive: data.isActive ?? true
      }
    });
  }

  async update(id: number, data: Partial<WarehouseDb>) {
    await this.prisma.warehouseDb.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.prisma.warehouseDb.delete({ where: { id } });
    return { success: true };
  }

  // --- Warehouse Inventory Management ---

  async getInventory(warehouseId: number) {
    return this.prisma.warehouseProductDb.findMany({
      where: { warehouseId },
      include: { product: true },
    });
  }

  async setInventory(warehouseId: number, productId: number, quantity: number) {
    let wp = await this.prisma.warehouseProductDb.findFirst({
      where: { warehouseId, productId },
    });

    if (wp) {
      wp = await this.prisma.warehouseProductDb.update({
        where: { id: wp.id },
        data: { quantity, updatedAt: new Date() }
      });
    } else {
      wp = await this.prisma.warehouseProductDb.create({
        data: {
          warehouseId,
          productId,
          quantity,
        }
      });
    }

    // Update aggregate stock in tbl_products
    await this.updateAggregateStock(productId);

    return wp;
  }

  private async updateAggregateStock(productId: number) {
    const allWarehouseProducts = await this.prisma.warehouseProductDb.findMany({
      where: { productId },
    });
    
    const totalStock = allWarehouseProducts.reduce((sum, wp) => sum + wp.quantity, 0);
    
    await this.prisma.productsDb.update({
      where: { id: productId },
      data: { stock: totalStock }
    });
  }
}
