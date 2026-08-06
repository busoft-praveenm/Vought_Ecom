import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
