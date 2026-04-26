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

  constructor(protected authService: AuthService) {
    super(authService);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('online')
  public handleOnline(@ConnectedSocket() socket: Socket): void {
    console.log(`User ${socket.user.handle} is now online`);

    this.online.set(socket.user.id, socket.user);

    const onlineList = [...this.online.values()];
    socket.emit('online_list', onlineList);

    this.server.emit('online', socket.user);
  }

  public handleDisconnect(socket: Socket): void {
    console.log(`User ${socket.user.handle} is now offline`);
    this.server.emit('offline', socket.user);
  }
}
