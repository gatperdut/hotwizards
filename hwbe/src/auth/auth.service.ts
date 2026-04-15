import { User } from '@hw/prismagen/client';
import { AuthLoginDto, AuthRegisterDto, AuthVerifyTokenDto } from '@hw/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';
import { AuthToken } from './types/auth-token.type.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    // Empty
  }

  public async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();

    return hash(password, salt);
  }

  private async generateToken(userId: number): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId });
  }

  public async register(params: AuthRegisterDto): Promise<AuthToken> {
    const hashedPassword: string = await this.hashPassword(params.password);

    const user: User = await this.usersService.create({
      ...params,
      password: hashedPassword,
      admin: false,
    });

    // TODO .toString....-_-
    const token: string = await this.generateToken(user.id);

    return { token: token };
  }

  public async login(params: AuthLoginDto): Promise<AuthToken> {
    const user = await this.usersService.byEmail({ email: params.email });

    if (!user || !(await compare(params.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = await this.generateToken(user.id);

    return { token: token };
  }

  public async verifyToken(params: AuthVerifyTokenDto): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(params.token, {
        secret: 'YOUR_SECRET_KEY', // TODO .env
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
