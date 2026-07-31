import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { OrderStatus, WarehouseDb } from '@prisma/client';
import { EmailService } from '../email/email.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  private razorpay: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
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
    const cart = await this.prisma.cartDb.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
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
    const amountInPaise = Math.round(total * 100);
    const rpOrder = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_user_${userId}_${Date.now()}`,
    });

    // 4. Determine nearest warehouse and delivery time
    let nearestWarehouse: WarehouseDb | null = null;
    let minDistance = Infinity;
    
    const user = await this.prisma.userDb.findUnique({ where: { id: userId }, include: { profile: true } });
    const userLat = user?.profile?.deliveryLat;
    const userLng = user?.profile?.deliveryLng;

    if (userLat && userLng) {
      const warehouses = await this.prisma.warehouseDb.findMany({ where: { isActive: true } });
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

    // 5. Save to DB using a transaction
    const savedOrder = await this.prisma.$transaction(async (tx) => {
      let expectedDeliveryDate: Date | null = null;
      let distanceKm: number | null = null;

      if (nearestWarehouse) {
        distanceKm = minDistance;
        const deliveryHours = (minDistance / 40) + (nearestWarehouse.processingTimeHours || 24);
        expectedDeliveryDate = new Date();
        expectedDeliveryDate.setHours(expectedDeliveryDate.getHours() + deliveryHours);
      }

      const newOrder = await tx.orderDb.create({
        data: {
          userId,
          subtotal,
          tax,
          total,
          status: OrderStatus.PENDING,
          razorpayOrderId: rpOrder.id,
          warehouseId: nearestWarehouse?.id,
          distanceKm,
          expectedDeliveryDate,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        }
      });

      return newOrder;
    });

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

    const order = await this.prisma.orderDb.findFirst({
      where: { razorpayOrderId, userId },
      include: { items: { include: { product: true } }, warehouse: true, user: { include: { profile: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.orderDb.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.ORDER_PLACED,
        razorpayPaymentId,
        razorpaySignature,
        updatedAt: new Date()
      },
      include: { items: { include: { product: true } }, warehouse: true, user: { include: { profile: true } } }
    });
    
    // Queue confirmation email
    this.emailService.queueOrderConfirmation(updatedOrder as any);

    // Decrement stock
    for (const item of order.items) {
      if (item.product) {
        await this.prisma.productsDb.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
        
        if (order.warehouseId) {
          await this.prisma.warehouseProductDb.updateMany({
            where: { warehouseId: order.warehouseId, productId: item.productId },
            data: { quantity: { decrement: item.quantity } }
          });
        }
      }
    }

    // Empty the cart
    const cart = await this.prisma.cartDb.findUnique({
      where: { userId },
    });
    if (cart) {
      await this.prisma.cartItemDb.deleteMany({ where: { cartId: cart.id } });
    }

    return { success: true, orderId: order.id };
  }

  async getOrders(userId: number, isAdmin: boolean) {
    if (isAdmin) {
      return this.prisma.orderDb.findMany({
        include: { user: { include: { profile: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return this.prisma.orderDb.findMany({
        where: { userId },
        include: { items: { include: { product: true } }, warehouse: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.orderDb.findUnique({ 
      where: { id: orderId },
      include: { user: { include: { profile: true } } }
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    const updatedOrder = await this.prisma.orderDb.update({
      where: { id: orderId },
      data: { status, updatedAt: new Date() },
      include: { user: { include: { profile: true } } }
    });
    
    if (status === OrderStatus.OUT_FOR_DELIVERY) {
      this.emailService.queueOrderOutForDelivery(updatedOrder as any);
    }
    
    return { success: true, orderId: updatedOrder.id, status: updatedOrder.status };
  }

  async getDeliveryEstimate(userId: number) {
    let nearestWarehouse: WarehouseDb | null = null;
    let minDistance = Infinity;
    
    const user = await this.prisma.userDb.findUnique({ where: { id: userId }, include: { profile: true } });
    const userLat = user?.profile?.deliveryLat;
    const userLng = user?.profile?.deliveryLng;

    if (userLat && userLng) {
      const warehouses = await this.prisma.warehouseDb.findMany({ where: { isActive: true } });
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
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
