import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';
import { AuthTokenPayload } from './types/auth-token-payload.type.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader: string = req.headers['authorization'] as string;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token: string = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const authTokenPayload: AuthTokenPayload = await this.authService.verifyToken(token);

    const user = await this.prismaService.user.findUnique({ where: { id: authTokenPayload.sub } });

    if (!user) {
      next();

      return;
    }

    const { password, ...strippedUser } = user;

    req.user = { ...strippedUser, me: true };

    next();
  }
}
