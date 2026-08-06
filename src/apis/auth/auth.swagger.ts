import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UpdateUserProfileDto } from '../users/dto/update-user-profile.dto';

export function SwaggerFirebaseLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login using Firebase authentication token' }),
    ApiHeader({ name: 'authorization', description: 'Bearer token from Firebase', required: true }),
    ApiBody({ required: false, description: 'Optional user data to update or create', type: LoginDto }),
    ApiResponse({ status: 201, description: 'Successfully logged in. Returns auth cookie and user info.' }),
    ApiResponse({ status: 401, description: 'Unauthorized. Invalid token.' })
  );
}

export function SwaggerLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user' }),
    ApiResponse({ status: 201, description: 'Successfully logged out. Clears auth cookie.' })
  );
}

export function SwaggerGetMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current logged-in user profile' }),
    ApiResponse({ status: 200, description: 'Returns user profile.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}

export function SwaggerUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user profile' }),
    ApiBody({ description: 'Profile data to update', type: UpdateUserProfileDto }),
    ApiResponse({ status: 200, description: 'Successfully updated profile.' }),
    ApiResponse({ status: 401, description: 'Unauthorized.' })
  );
}
