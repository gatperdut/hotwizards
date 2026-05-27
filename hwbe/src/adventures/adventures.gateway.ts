import { HwDungeonTransformData } from '@hw/shared/dungeon';
import { AdventuresDownstream, AdventuresUpstream } from '@hw/shared/sockets';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applySocketAuthMiddleware } from '../auth/middleware/socket-auth.middleware.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { applySocketAdventureMiddleware } from './middleware/socket-adventure.middleware.js';
import { AdventureCampaignMasterWsGuard } from './ws-guards/adventure-campaign-master.ws-guard.js';
import { AdventureProperTurnWsGuard } from './ws-guards/adventure-proper-turn.ws-guard.js';
import { SetAdventureCampaignWsGuard } from './ws-guards/set-adventure-campaign.ws-guard.js';

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

  @UseGuards(
    SetAdventureCampaignWsGuard,
    AdventureCampaignMasterWsGuard,
    AdventureProperTurnWsGuard,
  )
  @SubscribeMessage<keyof AdventuresUpstream>('upSelectMonster')
  public async handleUpOnline(
    @ConnectedSocket() socket: AdventuresSocket,
    @MessageBody() data: Parameters<AdventuresUpstream['upSelectMonster']>[0],
  ): Promise<void> {
    this.server.to(`adventure:${socket.adventure.id}`).emit('downSelectMonster', data.monsterId);
  }

  public async handleConnection(socket: AdventuresSocket): Promise<void> {
    await socket.join(`adventure:${socket.adventure.id}`);
  }

  public handleDownFinishAdventure(adventureId: number): void {
    this.server.to(`adventure:${adventureId}`).emit('downFinishAdventure');
  }

  public handleDownNextTurn(adventureId: number, data: HwDungeonTransformData): void {
    this.server.to(`adventure:${adventureId}`).emit('downNextTurn', data);
  }

  public handleDownUpdate(adventureId: number, data: HwDungeonTransformData): void {
    this.server.to(`adventure:${adventureId}`).emit('downUpdate', data);
  }
}
