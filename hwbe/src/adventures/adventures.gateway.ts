import { AdventuresDownstream, AdventuresUpstream } from '@hw/shared/sockets';
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

  public handleDownFinishAdventure(adventureId: number): void {
    this.server.to(`adventure:${adventureId}`).emit('downFinishAdventure');
  }

  public handleDownNextTurn(adventureId: number, turn: number): void {
    this.server.to(`adventure:${adventureId}`).emit('downNextTurn', turn);
  }
}
