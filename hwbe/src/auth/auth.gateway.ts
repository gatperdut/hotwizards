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

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  @SubscribeMessage<keyof PresenceUpstream>('upOnline')
  public async handleUpOnline(@ConnectedSocket() socket: PresenceSocket): Promise<void> {
    const userId = socket.user.id;

    await socket.join(`user:${userId}`);

    if (!this.online.has(userId)) {
      this.online.set(userId, socket.user);
      this.server.emit('downOnline', socket.user);
    }

    socket.emit('downOnlineList', [...this.online.values()]);
  }

  public async handleDisconnect(socket: PresenceSocket): Promise<void> {
    const userId = socket.user.id;

    const room = this.server.in(`user:${userId}`);

    const sockets = await room.fetchSockets();

    if (!sockets.length) {
      this.online.delete(userId);
      this.server.emit('downOffline', socket.user);
    }
  }
}
