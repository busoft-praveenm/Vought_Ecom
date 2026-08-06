import { Injectable } from "@nestjs/common";
import { CartDbService } from "@/common/db-services/cart-db.service";

@Injectable()
export class CartService {
  constructor(private readonly cartDbService: CartDbService) {}

  async getCart(userUid: string) {
    return this.cartDbService.getCart(userUid);
  }

  async addItem(userUid: string, productId: number, quantity: number) {
    return this.cartDbService.addItem(userUid, productId, quantity);
  }

  async updateItemQuantity(userUid: string, itemId: number, quantity: number) {
    return this.cartDbService.updateItemQuantity(userUid, itemId, quantity);
  }

  async removeItem(userUid: string, itemId: number) {
    return this.cartDbService.removeItem(userUid, itemId);
  }
}
