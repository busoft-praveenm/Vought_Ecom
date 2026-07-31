import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserStatus } from '@/common/entities/tbl_user.entity';

export function SwaggerGetCustomers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a paginated list of customers' }),
    ApiQuery({ name: 'page', required: false, type: String, description: 'Page number' }),
    ApiQuery({ name: 'limit', required: false, type: String, description: 'Items per page' }),
    ApiResponse({ status: 200, description: 'Successfully retrieved customers.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}

export function SwaggerUpdateUserStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user status' }),
    ApiParam({ name: 'id', required: true, type: String, description: 'User ID' }),
    ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: Object.values(UserStatus) } } } }),
    ApiResponse({ status: 200, description: 'User status updated successfully.' }),
    ApiResponse({ status: 400, description: 'Bad Request (e.g. invalid status or trying to deactivate primary admin).' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  );
}
