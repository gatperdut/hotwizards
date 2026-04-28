// presence/presence.gateway.ts
import { HwUser, PresenceDownstream, PresenceUpstream } from '@hw/shared';
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
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

type PresenceSocket = Socket<PresenceUpstream, PresenceDownstream>;

@WebSocketGateway({ namespace: 'presence' })
export class AuthGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() private readonly server: Server<PresenceUpstream, PresenceDownstream>;

  public readonly online = new Map<number, HwUser>();
  public readonly sessions = new Map<number, Set<Socket>>();

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  @SubscribeMessage<keyof PresenceUpstream>('upOnline')
  public handleUpOnline(@ConnectedSocket() socket: PresenceSocket): void {
    const userId = socket.user.id;

    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new Set());
    }

    this.sessions.get(userId)?.add(socket);

    if (!this.online.has(userId)) {
      this.online.set(userId, socket.user);
      this.server.emit('downOnline', socket.user);
    }

    socket.emit('downOnlineList', [...this.online.values()]);
  }

  public handleDisconnect(socket: PresenceSocket): void {
    const userId = socket.user.id;
    const userSessions = this.sessions.get(userId);

    if (!userSessions) {
      return;
    }

    userSessions.delete(socket);

    if (!userSessions.size) {
      this.sessions.delete(userId);
      this.online.delete(userId);
      this.server.emit('downOffline', socket.user);
    }
  }
}
