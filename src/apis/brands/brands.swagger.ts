import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

export function SwaggerGetBrands() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of brands' }),
    ApiQuery({ name: 'page', required: false, type: String }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Brands retrieved successfully.' })
  );
}

export function SwaggerGetRandomBrands() {
  return applyDecorators(
    ApiOperation({ summary: 'Get random brands (e.g. for homepage)' }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Random brands retrieved successfully.' })
  );
}

export function SwaggerGetBrandsAdmin() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of brands (Admin view)' }),
    ApiQuery({ name: 'page', required: false, type: String }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Admin brands retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerCreateBrand() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new brand' }),
    ApiBody({ description: 'Brand data', type: CreateBrandDto }),
    ApiResponse({ status: 201, description: 'Brand created successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerUpdateBrand() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a brand' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'Brand data to update', type: UpdateBrandDto }),
    ApiResponse({ status: 200, description: 'Brand updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerDeleteBrand() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a brand' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Brand deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
