import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartDb } from "../entities/tbl_cart.entity";
import { CartItemDb } from "../entities/tbl_cart_items.entity";
import { ProductsDb } from "../entities/tbl_products.entity";
import { UserDb } from "../entities/tbl_user.entity";

@Injectable()
export class CartDbService {

  constructor(
    @InjectRepository(CartDb)
    private readonly cartRepo: Repository<CartDb>,
    @InjectRepository(CartItemDb)
    private readonly cartItemRepo: Repository<CartItemDb>,
    @InjectRepository(ProductsDb)
    private readonly productRepo: Repository<ProductsDb>,
    @InjectRepository(UserDb)
    private readonly userRepo: Repository<UserDb>
  ){}

  async getCart(userUid: string) {
    const user = await this.userRepo.findOne({ where: { firebaseUid: userUid } });
    if (!user) throw new NotFoundException('User not found');

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!cart) {
      cart = this.cartRepo.create({ user });
      await this.cartRepo.save(cart);
    }

    const items = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['product']
    });

    return { cart, items };
  }

  async addItem(userUid: string, productId: number, quantity: number) {
    const { cart } = await this.getCart(userUid);
    const product = await this.productRepo.findOne({ where: { id: productId, isDeleted: false } });
    
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Not enough stock');

    let item = await this.cartItemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } }
    });

    if (item) {
      item.quantity += quantity;
      if (item.quantity > product.stock) item.quantity = product.stock;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({ cart, product, quantity });
      await this.cartItemRepo.save(item);
    }

    return this.getCart(userUid);
  }

  async updateItemQuantity(userUid: string, itemId: number, quantity: number) {
    const { cart } = await this.getCart(userUid);
    
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { id: cart.id } },
      relations: ['product']
    });

    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) {
      await this.cartItemRepo.remove(item);
      return this.getCart(userUid);
    }

    if (item.product.stock < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    item.quantity = quantity;
    await this.cartItemRepo.save(item);

    return this.getCart(userUid);
  }

  async removeItem(userUid: string, itemId: number) {
    const { cart } = await this.getCart(userUid);
    const item = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { id: cart.id } }
    });

    if (item) {
      await this.cartItemRepo.remove(item);
    }

    return this.getCart(userUid);
  }

}
