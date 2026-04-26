import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { HwUser } from '../../../shared/dist/shared/src/users/user.interface.js';
import { AuthService } from '../auth/auth.service.js';
import { AuthGateway } from './auth.gateway.js';
import { AuthGuard } from './guards/auth.guard.js';

@WebSocketGateway({
  namespace: 'presence',
  cors: { origin: 'http://localhost:4200' },
})
export class PresenceGateway extends AuthGateway implements OnGatewayDisconnect {
  private online = new Map<number, HwUser>();

  private sessions = new Map<number, Set<string>>();

  constructor(protected authService: AuthService) {
    super(authService);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('online')
  public handleOnline(@ConnectedSocket() socket: Socket): void {
    const userId = socket.user.id;

    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new Set());
    }

    this.sessions.get(userId)?.add(socket.id);

    if (!this.online.has(userId)) {
      this.online.set(userId, socket.user);
      this.server.emit('online', socket.user);
    }

    socket.emit('online_list', [...this.online.values()]);
  }

  public handleDisconnect(socket: Socket): void {
    const userId = socket.user.id;

    const userSessions = this.sessions.get(userId) as Set<string>;

    if (!userSessions) {
      return;
    }

    userSessions.delete(socket.id);

    if (!userSessions.size) {
      this.sessions.delete(userId);
      this.online.delete(userId);
      this.server.emit('offline', socket.user);
    }
  }
}
