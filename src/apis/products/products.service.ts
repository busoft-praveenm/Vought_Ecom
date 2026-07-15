import { ProductsDbService } from "@/common/db-services/products-db.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class ProductsService {

  constructor(
    private readonly productsDbService: ProductsDbService
  ){}

  async getProducts(page: number, limit: number, search: string){
    return this.productsDbService.getProducts(page, limit, search);
  }

  async getProduct(id: number){
    return this.productsDbService.getProductWithReviews(id);
  }

}