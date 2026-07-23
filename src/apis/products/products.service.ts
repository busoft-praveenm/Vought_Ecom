import { ProductsDbService } from "@/common/db-services/products-db.service";
import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";

@Injectable()
export class ProductsService {

  constructor(
    private readonly productsDbService: ProductsDbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    await this.cacheManager.del(cacheKey);
    
    // Also clear the individual product cache if it exists
    await this.cacheManager.del(`/products/${id}`);
    
    return product;
  }

  async deleteProduct(id: number) {
    await this.productsDbService.deleteProduct(id);
    await this.clearAllProductsCache();
  }

  private async clearAllProductsCache() {
    // Attempt to clear all cache keys starting with /products
    try {
      const cacheAny = this.cacheManager as any;
      const store = cacheAny.store || (cacheAny.stores && cacheAny.stores[0]);
      
      if (store && store.keys) {
        const keys = await store.keys('/products*');
        for (const key of keys) {
          await this.cacheManager.del(key);
        }
      } else {
        // Fallback if keys is not supported by the store
        await this.cacheManager.clear();
      }
    } catch (error) {
      await this.cacheManager.clear();
    }
  }
}