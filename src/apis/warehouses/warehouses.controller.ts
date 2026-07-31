import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehouseDb } from '@/common/entities/tbl_warehouse.entity';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerGetWarehouses, SwaggerGetWarehouse, SwaggerCreateWarehouse, SwaggerUpdateWarehouse, SwaggerDeleteWarehouse, SwaggerGetInventory, SwaggerSetInventory } from './warehouses.swagger';

@ApiBearerAuth()
@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @SwaggerGetWarehouses()
  @Get()
  async findAll() {
    return this.warehousesService.findAll();
  }

  @SwaggerGetWarehouse()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(+id);
  }



  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerCreateWarehouse()
  @Post()
  async create(@Body() data: Partial<WarehouseDb>) {
    return this.warehousesService.create(data);
  }



  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateWarehouse()
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<WarehouseDb>) {
    return this.warehousesService.update(+id, data);
  }



  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerDeleteWarehouse()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.warehousesService.delete(+id);
  }



  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerGetInventory()
  @Get(':id/inventory')
  async getInventory(@Param('id') id: string) {
    return this.warehousesService.getInventory(+id);
  }



  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerSetInventory()
  @Post(':id/inventory')
  async setInventory(
    @Param('id') id: string,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.warehousesService.setInventory(+id, body.productId, body.quantity);
  }
}
