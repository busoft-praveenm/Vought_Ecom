import { Controller, Get, Headers, Post, Put, Req, Res, UseGuards, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('login')
  async firebaseLogin(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) response: Response,
    @Body() body?: any
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
  @Get('me')
  async getMe(@Req() request: Request) {
    return {
      message: 'Success',
      user: request['dbUser']
    };
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('profile')
  async updateProfile(@Req() request: Request, @Body() body: any) {
    const userId = request['dbUser'].id;
    return this.authService.updateProfile(userId, body);
  }

}