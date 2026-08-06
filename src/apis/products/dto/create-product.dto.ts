import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  sku?: string;
  @IsOptional()
  @IsString()
  productUid?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  price: number;
  @IsOptional()
  @IsNumber()
  stock?: number;
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
  @IsOptional()
  @IsString()
  currency?: string;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  @IsOptional()
  @IsNumber()
  brandId?: number;
  @IsOptional()
  @IsNumber()
  createdById?: number;
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
