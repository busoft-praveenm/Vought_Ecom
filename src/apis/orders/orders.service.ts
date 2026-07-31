import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OrderDb, OrderStatus } from '@/common/entities/tbl_order.entity';
import { OrderItemDb } from '@/common/entities/tbl_order_items.entity';
import { CartDb } from '@/common/entities/tbl_cart.entity';
import { CartItemDb } from '@/common/entities/tbl_cart_items.entity';
import { ProductsDb } from '@/common/entities/tbl_products.entity';
import { WarehouseDb } from '@/common/entities/tbl_warehouse.entity';
import { WarehouseProductDb } from '@/common/entities/tbl_warehouse_products.entity';
import { UserDb } from '@/common/entities/tbl_user.entity';
import { EmailService } from '../email/email.service';
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
    @InjectRepository(WarehouseDb)
    private warehouseRepository: Repository<WarehouseDb>,
    @InjectRepository(WarehouseProductDb)
    private warehouseProductRepository: Repository<WarehouseProductDb>,
    @InjectRepository(UserDb)
    private userRepository: Repository<UserDb>,
    private configService: ConfigService,
    private emailService: EmailService,
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

    // 4. Determine nearest warehouse and delivery time
    let nearestWarehouse: WarehouseDb | null = null;
    let minDistance = Infinity;
    
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    const userLat = user?.profile?.deliveryLat;
    const userLng = user?.profile?.deliveryLng;

    if (userLat && userLng) {
      const warehouses = await this.warehouseRepository.find({ where: { isActive: true } });
      for (const w of warehouses) {
        if (w.lat && w.lng) {
          const dist = this.calculateDistance(Number(userLat), Number(userLng), Number(w.lat), Number(w.lng));
          if (dist < minDistance) {
            minDistance = dist;
            nearestWarehouse = w;
          }
        }
      }
    }

    // 5. Save to DB
    const order = new OrderDb();
    order.user = { id: userId } as any;
    order.subtotal = subtotal;
    order.tax = tax;
    order.total = total;
    order.status = OrderStatus.PENDING;
    order.razorpayOrderId = rpOrder.id;

    if (nearestWarehouse) {
      order.warehouse = nearestWarehouse;
      order.distanceKm = minDistance;
      // Expected delivery: Delivery Hours = (Distance in km / 40 km/h) + Warehouse Processing Time
      const deliveryHours = (minDistance / 40) + (nearestWarehouse.processingTimeHours || 24);
      const deliveryDate = new Date();
      deliveryDate.setHours(deliveryDate.getHours() + deliveryHours);
      order.expectedDeliveryDate = deliveryDate;
    }

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
      relations: ['items', 'items.product', 'warehouse', 'user', 'user.profile'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.ORDER_PLACED;
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;

    await this.orderRepository.save(order);
    
    // Queue confirmation email (fire-and-forget)
    this.emailService.queueOrderConfirmation(order);

    // Decrement stock for purchased items
    if (order.items) {
      for (const item of order.items) {
        if (item.product) {
          // Decrement aggregate stock
          await this.productsRepository.decrement(
            { id: item.product.id },
            'stock',
            item.quantity
          );
          
          // Decrement warehouse stock
          if (order.warehouse) {
            const wp = await this.warehouseProductRepository.findOne({
              where: { warehouse: { id: order.warehouse.id }, product: { id: item.product.id } }
            });
            if (wp) {
              await this.warehouseProductRepository.decrement(
                { id: wp.id },
                'quantity',
                item.quantity
              );
            }
          }
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
        relations: ['items', 'items.product', 'warehouse'],
        order: { createdAt: 'DESC' },
      });
    }
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ['user', 'user.profile']
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    order.status = status;
    await this.orderRepository.save(order);
    
    if (status === OrderStatus.OUT_FOR_DELIVERY) {
      this.emailService.queueOrderOutForDelivery(order);
    }
    
    return { success: true, orderId: order.id, status: order.status };
  }

  async getDeliveryEstimate(userId: number) {
    let nearestWarehouse: WarehouseDb | null = null;
    let minDistance = Infinity;
    
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    const userLat = user?.profile?.deliveryLat;
    const userLng = user?.profile?.deliveryLng;

    if (userLat && userLng) {
      const warehouses = await this.warehouseRepository.find({ where: { isActive: true } });
      for (const w of warehouses) {
        if (w.lat && w.lng) {
          const dist = this.calculateDistance(Number(userLat), Number(userLng), Number(w.lat), Number(w.lng));
          if (dist < minDistance) {
            minDistance = dist;
            nearestWarehouse = w;
          }
        }
      }
    }

    if (nearestWarehouse) {
      const deliveryHours = (minDistance / 40) + (nearestWarehouse.processingTimeHours || 24);
      const deliveryDate = new Date();
      deliveryDate.setHours(deliveryDate.getHours() + deliveryHours);
      return { estimatedDeliveryDate: deliveryDate };
    }

    return { estimatedDeliveryDate: null };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
