import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  name: string;
  sku?: string;
  productUid?: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  status?: ProductStatus;
  currency?: string;
  isActive?: boolean;
  brandId?: number;
  createdById?: number;
  categoryIds?: number[];
}
