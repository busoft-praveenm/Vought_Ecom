import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export function SwaggerGetProducts() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of products' }),
    ApiQuery({ name: 'page', required: false, type: String }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiQuery({ name: 'category', required: false, type: String }),
    ApiQuery({ name: 'brand', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
  );
}

export function SwaggerGetRandomProducts() {
  return applyDecorators(
    ApiOperation({ summary: 'Get random products (e.g. for trending)' }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Random products retrieved successfully.' })
  );
}

export function SwaggerGetProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Get product by ID' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Product retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Product not found.' })
  );
}

export function SwaggerCreateProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product' }),
    ApiBody({ description: 'Product data', type: CreateProductDto }),
    ApiResponse({ status: 201, description: 'Product created successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerUpdateProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a product' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'Product data to update', type: UpdateProductDto }),
    ApiResponse({ status: 200, description: 'Product updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerDeleteProduct() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a product' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Product deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
