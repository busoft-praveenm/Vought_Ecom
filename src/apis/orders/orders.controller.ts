import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('create')
  async createOrder(@Req() req: any) {
    return this.ordersService.createOrder(req.dbUser.id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('verify')
  async verifyPayment(
    @Req() req: any,
    @Body('razorpay_order_id') razorpayOrderId: string,
    @Body('razorpay_payment_id') razorpayPaymentId: string,
    @Body('razorpay_signature') razorpaySignature: string,
  ) {
    return this.ordersService.verifyPayment(
      req.dbUser.id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getOrders(@Req() req: any) {
    const isAdmin = req.dbUser.role?.name === 'admin';
    return this.ordersService.getOrders(req.dbUser.id, isAdmin);
  }
}
