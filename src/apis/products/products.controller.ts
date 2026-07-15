import { Controller, Get, Injectable, Param, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
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
    @Query('search') search = ''
  ){
    return this.productsService.getProducts(Number(page),Number(limit),search);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(Number(id));
  }
}