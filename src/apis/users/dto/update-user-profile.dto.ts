import { IsOptional, IsString, IsNumber } from 'class-validator';
export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  mobileNumber?: string;
  @IsOptional()
  @IsString()
  billingAddress?: string;
  @IsOptional()
  @IsString()
  deliveryAddress?: string;
  @IsOptional()
  @IsNumber()
  deliveryLat?: number;
  @IsOptional()
  @IsNumber()
  deliveryLng?: number;
}
