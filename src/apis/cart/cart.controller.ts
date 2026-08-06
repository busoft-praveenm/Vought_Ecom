import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartItemDto } from "./dto/cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerGetCart, SwaggerAddItem, SwaggerUpdateItemQuantity, SwaggerRemoveItem } from "./cart.swagger";

@ApiBearerAuth()
@ApiTags('Cart')
@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @SwaggerGetCart()
  @Get()
  async getCart(@Req() request: any) {
    const userUid = request.user.uid;
    return this.cartService.getCart(userUid);
  }

  @SwaggerAddItem()
  @Post('items')
  async addItem(@Req() request: any, @Body() body: CartItemDto) {
    const userUid = request.user.uid;
    return this.cartService.addItem(userUid, body.productId, body.quantity);
  }

  @SwaggerUpdateItemQuantity()
  @Patch('items/:id')
  async updateItem(@Req() request: any, @Param('id') id: string, @Body() body: UpdateCartItemDto) {
    const userUid = request.user.uid;
    return this.cartService.updateItemQuantity(userUid, Number(id), body.quantity);
  }

  @SwaggerRemoveItem()
  @Delete('items/:id')
  async removeItem(@Req() request: any, @Param('id') id: string) {
    const userUid = request.user.uid;
    return this.cartService.removeItem(userUid, Number(id));
  }
}
