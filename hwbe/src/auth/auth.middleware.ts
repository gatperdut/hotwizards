import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/generated/client';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthTokenPayload } from './types/auth-token-payload.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    // Empty
  }

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

    const authTokenPayload: AuthTokenPayload = this.authService.verifyToken({ token: token });

    req.user = (await this.userService.byId({ id: authTokenPayload.userId })) as User;

    next();
  }
}
