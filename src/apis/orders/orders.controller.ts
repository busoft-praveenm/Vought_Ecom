import { Controller, Post, Get, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FirebaseAuthGuard } from '@/guards/firebase.auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SwaggerCreateOrder, SwaggerVerifyPayment, SwaggerGetOrders, SwaggerGetDeliveryEstimate, SwaggerUpdateOrderStatus } from './orders.swagger';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(FirebaseAuthGuard)
  @SwaggerCreateOrder()
  @Post('create')
  async createOrder(@Req() req: any) {
    return this.ordersService.createOrder(req.dbUser.id);
  }

  @UseGuards(FirebaseAuthGuard)
  @SwaggerVerifyPayment()
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
  @SwaggerGetOrders()
  @Get()
  async getOrders(@Req() req: any) {
    const isAdmin = req.dbUser.role?.name === 'admin';
    return this.ordersService.getOrders(req.dbUser.id, isAdmin);
  }

  @UseGuards(FirebaseAuthGuard)
  @SwaggerGetDeliveryEstimate()
  @Get('estimate')
  async getDeliveryEstimate(@Req() req: any) {
    return this.ordersService.getDeliveryEstimate(req.dbUser.id);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateOrderStatus()
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }
}
