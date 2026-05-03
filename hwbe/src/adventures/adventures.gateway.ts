import { AdventuresDownstream, AdventuresUpstream } from '@hw/shared';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

type AdventuresSocket = Socket<AdventuresUpstream, AdventuresDownstream>;

@WebSocketGateway({ namespace: 'adventures' })
export class AdventuresGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<AdventuresUpstream, AdventuresDownstream>;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  public async handleConnection(socket: AdventuresSocket): Promise<void> {
    await socket.join(`user:${socket.user.id}`);
  }

  public handleDownFinishAdventure(
    campaignId: number,
    playerIds: number[],
    adventureTemplateName: string,
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downFinishAdventure', campaignId, adventureTemplateName);
  }

  public handleDownNextTurn(campaignId: number, turn: number): void {
    // const rooms = playerIds.map((id) => `user:${id}`);
    // this.server.to(rooms).emit('downNextTurn', campaignId, adventureTemplateName);
  }
}
