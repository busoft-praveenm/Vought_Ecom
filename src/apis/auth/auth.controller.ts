import { Controller, Headers, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { Response } from "express";


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('firebase-login')
  async firebaseLogin(
    @Headers('authorization') authHeader: string,
    @Res({ passthrough: true }) response: Response
  ){
    const token = authHeader?.replace('Bearer ', '');
    const result = await this.authService.fireBaseLogin(token);
    response.cookie(
      'access_token',
      result.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      },
    );

    return {
      message: 'Login Success',
      user: result.user
    }

  }

}