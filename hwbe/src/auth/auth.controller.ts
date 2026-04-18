import { HwAuthLoginDto, HwAuthRegisterDto, HwAuthVerifyTokenDto } from '@hw/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Body() body: HwAuthLoginDto) {
    return this.authService.login(body.identifier, body.password, body.rememberMe);
  }

  @Post('register')
  public async register(@Body() body: HwAuthRegisterDto) {
    return this.authService.register(body.handle, body.email, body.password);
  }

  @Post('verify-token')
  public async verifyToken(@Body() body: HwAuthVerifyTokenDto): Promise<AuthTokenPayload> {
    return await this.authService.verifyToken(body.token);
  }
}
