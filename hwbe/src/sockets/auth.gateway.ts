import { OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';

export abstract class AuthGateway<
  Downstream extends Record<string, any> = any,
  Upstream extends Record<string, any> = any,
> implements OnGatewayInit {
  @WebSocketServer() server: Server<Upstream, Downstream>;

  constructor(protected authService: AuthService) {}

  public afterInit(server: Server): void {
    server.use((socket, next): void => {
      const token = socket.handshake.auth?.token?.split(' ')[1];

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      this.authService
        .userFromToken(token)
        .then((user) => {
          if (!user) {
            return next(new Error('Unauthorized'));
          }

          socket.user = user;

          next();
        })
        .catch(() => next(new Error('Unauthorized')));
    });
  }
}
