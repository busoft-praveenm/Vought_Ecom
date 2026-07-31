import { PartialType } from '@nestjs/swagger';
import { UpdateUserProfileDto } from '../../users/dto/update-user-profile.dto';

export class LoginDto extends PartialType(UpdateUserProfileDto) {
  email?: string;
  uid?: string;
  name?: string;
  picture?: string;
}
