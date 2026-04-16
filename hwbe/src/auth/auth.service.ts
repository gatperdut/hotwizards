import { User } from '@hw/prismagen/client';
import { AuthLoginDto, AuthRegisterDto, AuthToken, AuthVerifyTokenDto } from '@hw/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Empty
  }

  public async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();

    return hash(password, salt);
  }

  private generateToken(userId: number, rememberMe: boolean): string {
    const options: JwtSignOptions | undefined = rememberMe ? { expiresIn: '7d' } : undefined;

    return this.jwtService.sign({ sub: userId }, options);
  }

  public async register(params: AuthRegisterDto): Promise<AuthToken> {
    const hashedPassword: string = await this.hashPassword(params.password);

    const user: User = await this.usersService.create({
      handle: params.handle,
      email: params.email,
      password: hashedPassword,
      admin: false,
    });

    const token: string = this.generateToken(user.id, false);

    return { token: token };
  }

  public async login(params: AuthLoginDto): Promise<AuthToken> {
    const user = await this.usersService.byIdentifier(params.identifier);

    if (!user || !(await compare(params.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = this.generateToken(user.id, params.rememberMe);

    return { token: token };
  }

  public async verifyToken(params: AuthVerifyTokenDto): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(params.token, {
        secret: this.configService.get('HWBE_JWT_KEY'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
