import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    return !!client.user;
  }
}
