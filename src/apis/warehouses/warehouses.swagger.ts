import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export function SwaggerGetWarehouses() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all warehouses' }),
    ApiResponse({ status: 200, description: 'Warehouses retrieved successfully.' })
  );
}

export function SwaggerGetWarehouse() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a specific warehouse by ID' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Warehouse retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Warehouse not found.' })
  );
}

export function SwaggerCreateWarehouse() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new warehouse' }),
    ApiBody({ description: 'Warehouse data' }),
    ApiResponse({ status: 201, description: 'Warehouse created successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerUpdateWarehouse() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a warehouse' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'Warehouse data to update' }),
    ApiResponse({ status: 200, description: 'Warehouse updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerDeleteWarehouse() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a warehouse' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Warehouse deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerGetInventory() {
  return applyDecorators(
    ApiOperation({ summary: 'Get inventory of a warehouse' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Inventory retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerSetInventory() {
  return applyDecorators(
    ApiOperation({ summary: 'Set inventory quantity for a product in a warehouse' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'Product ID and Quantity' }),
    ApiResponse({ status: 201, description: 'Inventory set successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
