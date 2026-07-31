import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseDb } from '@/common/entities/tbl_warehouse.entity';
import { WarehouseProductDb } from '@/common/entities/tbl_warehouse_products.entity';
import { ProductsDb } from '@/common/entities/tbl_products.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseDb)
    private readonly warehouseRepo: Repository<WarehouseDb>,
    @InjectRepository(WarehouseProductDb)
    private readonly warehouseProductRepo: Repository<WarehouseProductDb>,
    @InjectRepository(ProductsDb)
    private readonly productRepo: Repository<ProductsDb>,
  ) {}

  async findAll() {
    return this.warehouseRepo.find();
  }

  async findOne(id: number) {
    const warehouse = await this.warehouseRepo.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async create(data: Partial<WarehouseDb>) {
    const warehouse = this.warehouseRepo.create(data);
    return this.warehouseRepo.save(warehouse);
  }

  async update(id: number, data: Partial<WarehouseDb>) {
    await this.warehouseRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.warehouseRepo.delete(id);
    return { success: true };
  }

  // --- Warehouse Inventory Management ---

  async getInventory(warehouseId: number) {
    return this.warehouseProductRepo.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['product'],
    });
  }

  async setInventory(warehouseId: number, productId: number, quantity: number) {
    let wp = await this.warehouseProductRepo.findOne({
      where: { warehouse: { id: warehouseId }, product: { id: productId } },
    });

    if (wp) {
      wp.quantity = quantity;
    } else {
      wp = this.warehouseProductRepo.create({
        warehouse: { id: warehouseId } as WarehouseDb,
        product: { id: productId } as ProductsDb,
        quantity,
      });
    }
    await this.warehouseProductRepo.save(wp);

    // Update aggregate stock in tbl_products
    await this.updateAggregateStock(productId);

    return wp;
  }

  private async updateAggregateStock(productId: number) {
    const allWarehouseProducts = await this.warehouseProductRepo.find({
      where: { product: { id: productId } },
    });
    
    const totalStock = allWarehouseProducts.reduce((sum, wp) => sum + wp.quantity, 0);
    await this.productRepo.update(productId, { stock: totalStock });
  }
}
