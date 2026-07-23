import { Controller, Get, Post, Patch, Delete, Body, Injectable, Param, Query, UseGuards, UseInterceptors, Req } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";


@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ){}

  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000) // 5 minutes
  @Get()
  async getProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('category') category = '',
    @Query('brand') brand = '',
    @Req() req: any
  ){
    const isAdmin = req.dbUser?.role?.name === 'admin';
    return this.productsService.getProducts(Number(page),Number(limit),search, category, brand, isAdmin);
  }

  @Get('random')
  async getRandomProducts(@Query('limit') limit = '5') {
    // Note: We bypass ProductsService here for simplicity, 
    // since the other random methods access DbService directly or we can add it to ProductsService
    // Let's add it to ProductsService instead. Wait, ProductsController uses ProductsService, not ProductsDbService.
    // I need to check ProductsService if I should add it there.
    return this.productsService.getRandomProducts(Number(limit));
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(Number(id));
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createProduct(@Body() createProductDto: any) {
    return this.productsService.createProduct(createProductDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.updateProduct(Number(id), updateProductDto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}