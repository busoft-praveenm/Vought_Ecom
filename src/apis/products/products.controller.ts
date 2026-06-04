import { Controller, Get, Injectable, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";


@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ){}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = ''
  ){
    return this.productsService.getProducts(Number(page),Number(limit),search);
  }
}