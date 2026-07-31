import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';

export function SwaggerAddReview() {
  return applyDecorators(
    ApiOperation({ summary: 'Add a new review for a product' }),
    ApiBody({ type: CreateReviewDto }),
    ApiResponse({ status: 201, description: 'Review added successfully.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}
