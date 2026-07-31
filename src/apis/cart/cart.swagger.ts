import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export function SwaggerGetCart() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user cart' }),
    ApiResponse({ status: 200, description: 'Cart retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerAddItem() {
  return applyDecorators(
    ApiOperation({ summary: 'Add an item to the cart' }),
    ApiBody({ description: 'Product ID and Quantity', schema: { type: 'object', properties: { productId: { type: 'number' }, quantity: { type: 'number' } } } }),
    ApiResponse({ status: 201, description: 'Item added successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerUpdateItemQuantity() {
  return applyDecorators(
    ApiOperation({ summary: 'Update cart item quantity' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'New quantity', schema: { type: 'object', properties: { quantity: { type: 'number' } } } }),
    ApiResponse({ status: 200, description: 'Item quantity updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerRemoveItem() {
  return applyDecorators(
    ApiOperation({ summary: 'Remove an item from the cart' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Item removed successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}
