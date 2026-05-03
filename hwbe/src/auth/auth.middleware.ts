import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

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

    const user = await this.authService.userFromToken(token);

    if (!user) {
      throw new UnauthorizedException('Authorization token is invalid');
    }

    req.user = user;

    next();
  }
}
