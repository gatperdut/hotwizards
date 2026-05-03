import { AdventuresDownstream, AdventuresUpstream } from '@hw/shared';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applySocketAuthMiddleware } from '../auth/middleware/socket-auth.middleware.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { applySocketAdventureMiddleware } from './middleware/socket-adventure.middleware.js';

type AdventuresSocket = Socket<AdventuresUpstream, AdventuresDownstream>;

@WebSocketGateway({ namespace: 'adventures' })
export class AdventuresGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private server: Server<AdventuresUpstream, AdventuresDownstream>;

  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
    applySocketAdventureMiddleware(server, this.prismaService);
  }

  public async handleConnection(socket: AdventuresSocket): Promise<void> {
    await socket.join(`adventure:${socket.adventure.id}`);
  }

  public handleDownFinishAdventure(
    campaignId: number,
    adventureId: number,
    adventureTemplateName: string,
  ): void {
    this.server
      .to(`adventure:${adventureId}`)
      .emit('downFinishAdventure', campaignId, adventureTemplateName);
  }

  public handleDownNextTurn(campaignId: number, adventureId: number, turn: number): void {
    this.server.to(`adventure:${adventureId}`).emit('downNextTurn', campaignId, turn);
  }
}
