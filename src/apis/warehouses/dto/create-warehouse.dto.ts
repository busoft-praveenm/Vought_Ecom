import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
export class CreateWarehouseDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsNumber()
  lat: number;
  @IsNumber()
  lng: number;
  @IsOptional()
  @IsNumber()
  processingTimeHours?: number;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
