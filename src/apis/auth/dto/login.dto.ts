import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { UpdateUserProfileDto } from '../../users/dto/update-user-profile.dto';

export class LoginDto extends PartialType(UpdateUserProfileDto) {
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  uid?: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  picture?: string;
}
