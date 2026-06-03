import {
  HwTransformEndTurnHero,
  HwTransformEndTurnMaster,
  HwTransformMoveHero,
  HwTransformMoveMonster,
  HwTransformOpenDoor,
} from '@hw/shared/dungeon';
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
    await socket.join(`adventure:${socket.adventureId}`);
  }

  public handleDownFinishAdventure(adventureId: number): void {
    this.server.to(`adventure:${adventureId}`).emit('downFinishAdventure');
  }

  public handleDownEndTurnMaster(adventureId: number, data: HwTransformEndTurnMaster): void {
    this.server.to(`adventure:${adventureId}`).emit('downEndTurnMaster', data);
  }

  public handleDownEndTurnHero(adventureId: number, data: HwTransformEndTurnHero): void {
    this.server.to(`adventure:${adventureId}`).emit('downEndTurnHero', data);
  }

  public handleDownSelectMonster(adventureId: number, monsterId: number | null): void {
    this.server.to(`adventure:${adventureId}`).emit('downSelectMonster', monsterId);
  }

  public handleDownMoveHero(adventureId: number, data: HwTransformMoveHero): void {
    this.server.to(`adventure:${adventureId}`).emit('downMoveHero', data);
  }

  public handleDownMoveMonster(adventureId: number, data: HwTransformMoveMonster): void {
    this.server.to(`adventure:${adventureId}`).emit('downMoveMonster', data);
  }

  public handleDownOpenDoor(adventureId: number, data: HwTransformOpenDoor): void {
    this.server.to(`adventure:${adventureId}`).emit('downOpenDoor', data);
  }
}
