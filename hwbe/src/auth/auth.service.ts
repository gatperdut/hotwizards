import { User } from '@hw/prismagen/client';
import { AuthRegisterDto } from '@hw/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service.js';
import { AuthLoginDto } from './dto/auth-login.dto.js';
import { AuthVerifyTokenDto } from './dto/auth-verify-token.dto.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';
import { AuthToken } from './types/auth-token.type.js';

// TODO use jwtService (@nestjs/jwt) instead of jsonwebtoken directly
@Injectable()
export class AuthService {
  private readonly jwtSecret: string = 'supersecretkey'; // TODO .env

  constructor(private usersService: UsersService) {
    // Empty
  }

  public async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  public generateToken(userId: number): string {
    return jwt.sign(
      {
        userId: userId,
      },
      this.jwtSecret,
      {
        expiresIn: '12h',
      },
    );
  }

  public async register(params: AuthRegisterDto): Promise<AuthToken> {
    const hashedPassword: string = await this.hashPassword(params.password);

    const user: User = await this.usersService.create({
      ...params,
      password: hashedPassword,
      admin: false,
    });

    const token: string = this.generateToken(user.id);

    return { token: token };
  }

  public async login(params: AuthLoginDto): Promise<AuthToken> {
    const user = await this.usersService.byEmail({ email: params.email });

    if (!user || !(await bcrypt.compare(params.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = this.generateToken(user.id);

    return { token: token };
  }

  public verifyToken(params: AuthVerifyTokenDto): AuthTokenPayload {
    try {
      return jwt.verify(params.token, this.jwtSecret) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
