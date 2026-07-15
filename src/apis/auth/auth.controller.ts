import { Controller, Headers, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('login')
  async firebaseLogin(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) response: Response
  ){
    
    const token = authHeader?.replace('Bearer ', '');
    // console.log('login firebase entered: ', token);
    const result = await this.authService.fireBaseLogin(token);
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

}