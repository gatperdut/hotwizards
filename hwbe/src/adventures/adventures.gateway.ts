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
import { applyAuthWsMiddleware } from '../auth/ws-middleware/auth.ws-middleware.js';
import { PrismaService } from '../prisma/prisma.service.js';

type AdventuresSocket = Socket<AdventuresUpstream, AdventuresDownstream>;

@WebSocketGateway({ namespace: 'adventures' })
export class AdventuresGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private server: Server<AdventuresUpstream, AdventuresDownstream>;

  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  public afterInit(server: Server): void {
    void applyAuthWsMiddleware(server, this.authService, this.prismaService, true);
  }

  public async handleConnection(socket: AdventuresSocket): Promise<void> {
    await socket.join(`campaign:${socket.campaignId}:adventure`);
  }

  public handleDownFinishAdventure(campaignId: number): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downFinishAdventure');
  }

  public handleDownEndTurnMaster(campaignId: number, data: HwTransformEndTurnMaster): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downEndTurnMaster', data);
  }

  public handleDownEndTurnHero(campaignId: number, data: HwTransformEndTurnHero): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downEndTurnHero', data);
  }

  public handleDownSelectMonster(campaignId: number, monsterId: number | null): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downSelectMonster', monsterId);
  }

  public handleDownMoveHero(campaignId: number, data: HwTransformMoveHero): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downMoveHero', data);
  }

  public handleDownMoveMonster(campaignId: number, data: HwTransformMoveMonster): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downMoveMonster', data);
  }

  public handleDownOpenDoor(campaignId: number, data: HwTransformOpenDoor): void {
    this.server.to(`campaign:${campaignId}:adventure`).emit('downOpenDoor', data);
  }
}
