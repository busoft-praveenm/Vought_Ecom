import { ProductsDbService } from "@/common/db-services/products-db.service";
import { Injectable, Inject } from "@nestjs/common";
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductsService {

  constructor(
    private readonly productsDbService: ProductsDbService,
    @InjectQueue('cache-invalidation') private cacheQueue: Queue,
  ){}

  async getProducts(page = 1, limit = 10, search = '', category = '', brand = '', isAdmin = false) {
    return this.productsDbService.getProducts(page, limit, search, category, brand, isAdmin);
  }

  async getRandomProducts(limit = 5) {
    return this.productsDbService.getRandomProducts(limit);
  }

  async getProduct(id: number){
    return this.productsDbService.getProductWithReviews(id);
  }

  async createProduct(data: any) {
    const product = await this.productsDbService.createProduct(data);
    await this.clearAllProductsCache();
    return product;
  }

  async updateProduct(id: number, data: any) {
    const page = await this.productsDbService.getProductPage(id, 10);
    const product = await this.productsDbService.updateProduct(id, data);
    
    // Clear only the cache for the specific page where the product is present
    const cacheKey = `/products?page=${page}&limit=10&search=`;
    
    await this.cacheQueue.add('clear-specific-keys', { 
      keys: [cacheKey, `/products/${id}`] 
    });
    
    return product;
  }

  async deleteProduct(id: number) {
    await this.productsDbService.deleteProduct(id);
    await this.clearAllProductsCache();
  }

  private async clearAllProductsCache() {
    await this.cacheQueue.add('clear-all-products', {});
  }
}