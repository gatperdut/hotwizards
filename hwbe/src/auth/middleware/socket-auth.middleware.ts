// auth/socket-auth.middleware.ts
import { Server } from 'socket.io';
import { AuthService } from '../auth.service.js';

export function applySocketAuthMiddleware(server: Server, authService: AuthService): void {
  server.use((socket, next): void => {
    const token = socket.handshake.auth?.token?.split(' ')[1];

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    authService
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
