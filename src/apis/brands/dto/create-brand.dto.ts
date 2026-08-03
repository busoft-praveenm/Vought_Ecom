import { IsString, IsOptional, IsBoolean } from 'class-validator';
export class CreateBrandDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
