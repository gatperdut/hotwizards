import { HwAuthResponse, HwUser } from '@hw/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { HwTokenPayload } from './types/token-payload.type.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt();

    return hash(password, salt);
  }

  private generateToken(userId: number, rememberMe: boolean): string {
    return this.jwtService.sign(
      { sub: userId },
      ...(rememberMe ? [{ expiresIn: '7d' } as JwtSignOptions] : []),
    );
  }

  public async register(handle: string, email: string, password: string): Promise<HwAuthResponse> {
    const hashedPassword: string = await this.hashPassword(password);

    const user: HwUser = await this.usersService.create(handle, email, hashedPassword, false);

    const token: string = this.generateToken(user.id, false);

    return {
      user: {
        ...user,
        me: true,
      },
      token: token,
    };
  }

  public async login(
    identifier: string,
    providedPassword: string,
    rememberMe: boolean,
  ): Promise<HwAuthResponse> {
    const user = await this.usersService.byIdentifier(identifier);

    if (!user || !(await compare(providedPassword, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token: string = this.generateToken(user.id, rememberMe);

    const { password, ...strippedUser } = user;

    return {
      user: {
        ...strippedUser,
        me: true,
      },
      token: token,
    };
  }

  public async verifyToken(token: string): Promise<HwTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('HWBE_JWT_KEY'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  public async userFromToken(token: string): Promise<HwUser | null> {
    const payload = await this.verifyToken(token);
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    const { password, ...strippedUser } = user;
    return { ...strippedUser, me: true };
  }
}
