import { HwUser, PresenceDownstream, PresenceUpstream } from '@hw/shared';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { AuthGateway } from './auth.gateway.js';
import { AuthGuard } from './guards/auth.guard.js';

@WebSocketGateway({
  namespace: 'presence',
})
export class PresenceGateway
  extends AuthGateway<PresenceDownstream, PresenceUpstream>
  implements OnGatewayDisconnect
{
  private online = new Map<number, HwUser>();

  private sessions = new Map<number, Set<string>>();

  constructor(protected authService: AuthService) {
    super(authService);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage<keyof PresenceUpstream>('upOnline')
  public handleOnline(
    @ConnectedSocket() socket: Socket<PresenceUpstream, PresenceDownstream>,
  ): void {
    const userId = socket.user.id;

    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, new Set());
    }

    this.sessions.get(userId)?.add(socket.id);

    if (!this.online.has(userId)) {
      this.online.set(userId, socket.user);
      this.server.emit('downOnline', socket.user);
    }

    socket.emit('downOnlineList', [...this.online.values()]);
  }

  public handleDisconnect(socket: Socket<PresenceUpstream, PresenceDownstream>): void {
    const userId = socket.user.id;

    const userSessions = this.sessions.get(userId) as Set<string>;

    if (!userSessions) {
      return;
    }

    userSessions.delete(socket.id);

    if (!userSessions.size) {
      this.sessions.delete(userId);
      this.online.delete(userId);
      this.server.emit('downOffline', socket.user);
    }
  }
}
