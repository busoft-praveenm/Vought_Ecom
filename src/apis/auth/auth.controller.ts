import { Controller, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('firebase-login')
  async firebaseLogin(
    @Headers('authorization') authHeader: string,
  ){
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.fireBaseLogin(token);
  }

}