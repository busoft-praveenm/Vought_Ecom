import { IsNumber } from 'class-validator';
export class SetInventoryDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  quantity: number;
}
