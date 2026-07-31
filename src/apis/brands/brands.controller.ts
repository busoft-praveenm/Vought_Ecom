import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from "@nestjs/common";
import { BrandDbService } from "@/common/db-services/brand-db.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
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
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandDbService.createBrand(createBrandDto.name, createBrandDto.description, createBrandDto.imageUrl);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateBrand()
  @Patch(':id')
  async updateBrand(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandDbService.updateBrand(Number(id), updateBrandDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerDeleteBrand()
  @Delete(':id')
  async deleteBrand(@Param('id') id: string) {
    return this.brandDbService.deleteBrand(Number(id));
  }
}
