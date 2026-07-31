import { Controller, Get, Headers, Post, Put, Req, Res, UseGuards, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { UpdateUserProfileDto } from "../users/dto/update-user-profile.dto";
import type { Request, Response } from "express";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerFirebaseLogin, SwaggerLogout, SwaggerGetMe, SwaggerUpdateProfile } from "./auth.swagger";

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @SwaggerFirebaseLogin()
  @Post('login')
  async firebaseLogin(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) response: Response,
    @Body() body?: LoginDto
  ){
    
    const token = authHeader?.replace('Bearer ', '');
    // console.log('login firebase entered: ', token);
    const result = await this.authService.fireBaseLogin(token, body);
    // console.log('result firebaselogin: ', result);
    response.cookie(
      'access_token',
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
      },
    );

    return {
      message: 'Login Success',
      user: result.user
    }

  }

  @SwaggerLogout()
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({passthrough: true}) response: Response
  ){
  //   console.log(
  //   'cookies:',
  //   request.cookies
  // );

  // console.log(
  //   'access_token:',
  //   request.cookies
  //     ?.access_token
  // );
    response.clearCookie(
      'access_token',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        // maxAge: 1000 * 60 * 60 * 24,
      }
    );
    
    return { message: 'Logout Success' };
  }

  @UseGuards(FirebaseAuthGuard)
  @SwaggerGetMe()
  @Get('me')
  async getMe(@Req() request: Request) {
    return {
      message: 'Success',
      user: request['dbUser']
    };
  }

  @UseGuards(FirebaseAuthGuard)
  @SwaggerUpdateProfile()
  @Put('profile')
  async updateProfile(@Req() request: Request, @Body() body: UpdateUserProfileDto) {
    const userId = request['dbUser'].id;
    return this.authService.updateProfile(userId, body);
  }

}