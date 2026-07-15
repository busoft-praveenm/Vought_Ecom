import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() request: any) {
    const userUid = request.user.uid;
    return this.cartService.getCart(userUid);
  }

  @Post('items')
  async addItem(@Req() request: any, @Body() body: { productId: number; quantity: number }) {
    const userUid = request.user.uid;
    return this.cartService.addItem(userUid, body.productId, body.quantity);
  }

  @Patch('items/:id')
  async updateItem(@Req() request: any, @Param('id') id: string, @Body() body: { quantity: number }) {
    const userUid = request.user.uid;
    return this.cartService.updateItemQuantity(userUid, Number(id), body.quantity);
  }

  @Delete('items/:id')
  async removeItem(@Req() request: any, @Param('id') id: string) {
    const userUid = request.user.uid;
    return this.cartService.removeItem(userUid, Number(id));
  }
}
