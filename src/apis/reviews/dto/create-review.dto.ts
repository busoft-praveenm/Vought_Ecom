import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateReviewDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  rating: number;
  @IsOptional()
  @IsString()
  reviewText?: string;
}
