import { HwAuthResponse, HwUser } from '@hw/shared';
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
  ) {}

  public async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();

    return hash(password, salt);
  }

  private generateToken(userId: number, rememberMe: boolean): string {
    const options: JwtSignOptions | undefined = rememberMe ? { expiresIn: '7d' } : undefined;

    return this.jwtService.sign({ sub: userId }, options);
  }

  public async register(handle: string, email: string, password: string): Promise<HwAuthResponse> {
    const hashedPassword: string = await this.hashPassword(password);

    const user: HwUser = await this.usersService.create(handle, email, hashedPassword, false);

    const token: string = this.generateToken(user.id, false);

    return {
      user: {
        id: user.id,
        handle: user.handle,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
      },
      token: token,
    };
  }

  public async login(
    identifier: string,
    password: string,
    rememberMe: boolean,
  ): Promise<HwAuthResponse> {
    const user = await this.usersService.byIdentifier(identifier);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = this.generateToken(user.id, rememberMe);

    return {
      user: {
        id: user.id,
        handle: user.handle,
        email: user.email,
        admin: user.admin,
        createdAt: user.createdAt,
      },
      token: token,
    };
  }

  public async verifyToken(token: string): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('HWBE_JWT_KEY'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
