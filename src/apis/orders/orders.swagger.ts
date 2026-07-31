import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

export function SwaggerCreateOrder() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new order from current user cart' }),
    ApiResponse({ status: 201, description: 'Order created successfully. Returns Razorpay order details.' }),
    ApiResponse({ status: 400, description: 'Cart is empty or some items are unavailable.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerVerifyPayment() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify Razorpay payment and complete order' }),
    ApiBody({ description: 'Razorpay payment details', type: VerifyPaymentDto }),
    ApiResponse({ status: 201, description: 'Payment verified successfully. Order status updated.' }),
    ApiResponse({ status: 400, description: 'Invalid signature.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerGetOrders() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of orders (returns all for admin, user-specific for regular user)' }),
    ApiResponse({ status: 200, description: 'Orders retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerGetDeliveryEstimate() {
  return applyDecorators(
    ApiOperation({ summary: 'Get delivery estimate based on user location and warehouse' }),
    ApiResponse({ status: 200, description: 'Delivery estimate retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerUpdateOrderStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Update order status' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'New order status', type: UpdateOrderStatusDto }),
    ApiResponse({ status: 200, description: 'Order status updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
