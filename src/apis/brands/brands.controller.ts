import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from "@nestjs/common";
import { BrandDbService } from "@/common/db-services/brand-db.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerGetBrands, SwaggerGetRandomBrands, SwaggerGetBrandsAdmin, SwaggerCreateBrand, SwaggerUpdateBrand, SwaggerDeleteBrand } from "./brands.swagger";

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandDbService: BrandDbService) {}

  @SwaggerGetBrands()
  @Get()
  async getBrands(
    @Query('page') page = '1',
    @Query('limit') limit = '50'
  ) {
    return this.brandDbService.findAll(Number(page), Number(limit));
  }

  @SwaggerGetRandomBrands()
  @Get('random')
  async getRandomBrands(@Query('limit') limit = '6') {
    return this.brandDbService.getRandomBrands(Number(limit));
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerGetBrandsAdmin()
  @Get('admin')
  async getBrandsAdmin(
    @Query('page') page = '1',
    @Query('limit') limit = '50'
  ) {
    return this.brandDbService.findAll(Number(page), Number(limit), true);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerCreateBrand()
  @Post()
  async createBrand(@Body() body: { name: string; description?: string; imageUrl?: string }) {
    return this.brandDbService.createBrand(body.name, body.description, body.imageUrl);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateBrand()
  @Patch(':id')
  async updateBrand(@Param('id') id: string, @Body() body: any) {
    return this.brandDbService.updateBrand(Number(id), body);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerDeleteBrand()
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return this.brandDbService.deleteBrand(Number(id));
  }
}
