// presence/presence.gateway.ts
import { PresenceDownstream, PresenceUpstream } from '@hw/shared';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { PresenceService } from '../presence/presence.service.js';
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

type PresenceSocket = Socket<PresenceUpstream, PresenceDownstream>;

@WebSocketGateway({ namespace: 'presence' })
export class AuthGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() private readonly server: Server<PresenceUpstream, PresenceDownstream>;

  constructor(
    private readonly authService: AuthService,
    private readonly presenceService: PresenceService,
  ) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  @SubscribeMessage<keyof PresenceUpstream>('upOnline')
  public handleUpOnline(
    @ConnectedSocket() socket: Socket<PresenceUpstream, PresenceDownstream>,
  ): void {
    const userId = socket.user.id;

    if (!this.presenceService.sessions.has(userId)) {
      this.presenceService.sessions.set(userId, new Set());
    }

    this.presenceService.sessions.get(userId)?.add(socket);

    if (!this.presenceService.online.has(userId)) {
      this.presenceService.online.set(userId, socket.user);
      this.server.emit('downOnline', socket.user);
    }

    socket.emit('downOnlineList', [...this.presenceService.online.values()]);
  }

  public handleDisconnect(socket: Socket<PresenceUpstream, PresenceDownstream>): void {
    const userId = socket.user.id;
    const userSessions = this.presenceService.sessions.get(userId);

    if (!userSessions) {
      return;
    }

    userSessions.delete(socket);

    if (!userSessions.size) {
      this.presenceService.sessions.delete(userId);
      this.presenceService.online.delete(userId);
      this.server.emit('downOffline', socket.user);
    }
  }
}
