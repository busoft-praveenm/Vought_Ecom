import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

export function SwaggerGetCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of categories' }),
    ApiQuery({ name: 'page', required: false, type: String }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  );
}

export function SwaggerGetRandomCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get random categories (e.g. for homepage)' }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Random categories retrieved successfully.' })
  );
}

export function SwaggerGetCategoriesAdmin() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of categories (Admin view)' }),
    ApiQuery({ name: 'page', required: false, type: String }),
    ApiQuery({ name: 'limit', required: false, type: String }),
    ApiResponse({ status: 200, description: 'Admin categories retrieved successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerCreateCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new category' }),
    ApiBody({ description: 'Category data' }),
    ApiResponse({ status: 201, description: 'Category created successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerUpdateCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a category' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiBody({ description: 'Category data to update' }),
    ApiResponse({ status: 200, description: 'Category updated successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerDeleteCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a category' }),
    ApiParam({ name: 'id', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Category deleted successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
