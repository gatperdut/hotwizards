import { AuthRegisterDto } from '@hw/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { AuthVerifyTokenDto } from './dto/auth-verify-token.dto.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';

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
