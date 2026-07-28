import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OrderDb, OrderStatus } from '@/common/entities/tbl_order.entity';
import { OrderItemDb } from '@/common/entities/tbl_order_items.entity';
import { CartDb } from '@/common/entities/tbl_cart.entity';
import { CartItemDb } from '@/common/entities/tbl_cart_items.entity';
import { ProductsDb } from '@/common/entities/tbl_products.entity';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(OrderDb)
    private orderRepository: Repository<OrderDb>,
    @InjectRepository(OrderItemDb)
    private orderItemRepository: Repository<OrderItemDb>,
    @InjectRepository(CartDb)
    private cartRepository: Repository<CartDb>,
    @InjectRepository(CartItemDb)
    private cartItemRepository: Repository<CartItemDb>,
    @InjectRepository(ProductsDb)
    private productsRepository: Repository<ProductsDb>,
    private configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || '',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || '',
    });
  }

  async createOrder(userId: number) {
    // 1. Fetch user's cart
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Calculate totals
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.quantity * Number(item.product.price);
    }
    const tax = 0;
    const total = subtotal + tax;

    // 3. Create Razorpay order
    // Razorpay amount is in smallest currency unit (e.g. paise for INR)
    const amountInPaise = Math.round(total * 100);
    const rpOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_user_${userId}_${Date.now()}`,
    });

    // 4. Save to DB
    const order = new OrderDb();
    order.user = { id: userId } as any;
    order.subtotal = subtotal;
    order.tax = tax;
    order.total = total;
    order.status = OrderStatus.PENDING;
    order.razorpayOrderId = rpOrder.id;

    const savedOrder = await this.orderRepository.save(order);

    // Save items
    const orderItems: OrderItemDb[] = [];
    for (const item of cart.items) {
      const oi = new OrderItemDb();
      oi.order = savedOrder;
      oi.product = item.product;
      oi.quantity = item.quantity;
      oi.price = item.product.price;
      orderItems.push(oi);
    }
    await this.orderItemRepository.save(orderItems);

    return {
      orderId: savedOrder.id,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    };
  }

  async verifyPayment(
    userId: number,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new BadRequestException('Invalid signature');
    }

    const order = await this.orderRepository.findOne({
      where: { razorpayOrderId, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.PAID;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;

    await this.orderRepository.save(order);

    // Decrement stock for purchased items
    if (order.items) {
      for (const item of order.items) {
        if (item.product) {
          await this.productsRepository.decrement(
            { id: item.product.id },
            'stock',
            item.quantity
          );
        }
      }
    }

    // Empty the cart
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (cart) {
      await this.cartItemRepository.delete({ cart: { id: cart.id } });
    }

    return { success: true, orderId: order.id };
  }

  async getOrders(userId: number, isAdmin: boolean) {
    if (isAdmin) {
      return this.orderRepository.find({
        relations: ['user', 'items', 'items.product', 'user.profile'],
        order: { createdAt: 'DESC' },
      });
    } else {
      return this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
    }
  }
}
