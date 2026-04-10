import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthVerifyTokenDto } from './dto/auth-verify-token.dto';
import { AuthTokenPayload } from './types/auth-token-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    // Empty
  }

  @Post('login')
  public async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  public async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('verify-token')
  public verifyToken(@Body() body: AuthVerifyTokenDto): AuthTokenPayload {
    return this.authService.verifyToken(body);
  }
}
