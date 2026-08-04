import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CartDbService {

  constructor(private readonly prisma: PrismaService){}

  async getCart(userUid: string) {
    const user = await this.prisma.userDb.findUnique({ where: { firebaseUid: userUid } });
    if (!user) throw new NotFoundException('User not found');

    let cart = await this.prisma.cartDb.findUnique({
      where: { userId: user.id }
    });

    if (!cart) {
      try {
        cart = await this.prisma.cartDb.create({
          data: { userId: user.id }
        });
      } catch (dbError: any) {
        if (dbError.code === 'P2002') {
          cart = await this.prisma.cartDb.findUnique({
            where: { userId: user.id }
          });
          if (!cart) throw dbError;
        } else {
          throw dbError;
        }
      }
    }

    const items = await this.prisma.cartItemDb.findMany({
      where: { cartId: cart.id },
      include: { product: true }
    });

    return { cart, items };
  }

  async addItem(userUid: string, productId: number, quantity: number) {
    const { cart } = await this.getCart(userUid);
    const product = await this.prisma.productsDb.findFirst({ 
      where: { id: productId, isDeleted: false } 
    });
    
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Not enough stock');

    let item = await this.prisma.cartItemDb.findFirst({
      where: { cartId: cart.id, productId: product.id }
    });

    if (item) {
      let newQuantity = item.quantity + quantity;
      if (newQuantity > product.stock) newQuantity = product.stock;
      
      await this.prisma.cartItemDb.update({
        where: { id: item.id },
        data: { quantity: newQuantity }
      });
    } else {
      await this.prisma.cartItemDb.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity
        }
      });
    }

    return this.getCart(userUid);
  }

  async updateItemQuantity(userUid: string, itemId: number, quantity: number) {
    const { cart } = await this.getCart(userUid);
    
    const item = await this.prisma.cartItemDb.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true }
    });

    if (!item) throw new NotFoundException('Item not found in cart');
    if (quantity <= 0) return this.removeItem(userUid, itemId);
    if (item.product.stock < quantity) throw new BadRequestException('Not enough stock');

    await this.prisma.cartItemDb.update({
      where: { id: item.id },
      data: { quantity }
    });

    return this.getCart(userUid);
  }

  async removeItem(userUid: string, itemId: number) {
    const { cart } = await this.getCart(userUid);
    
    const item = await this.prisma.cartItemDb.findFirst({
      where: { id: itemId, cartId: cart.id }
    });

    if (!item) throw new NotFoundException('Item not found in cart');

    await this.prisma.cartItemDb.delete({
      where: { id: item.id }
    });

    return this.getCart(userUid);
  }

  async clearCart(cartId: number) {
    await this.prisma.cartItemDb.deleteMany({
      where: { cartId }
    });
  }

}
