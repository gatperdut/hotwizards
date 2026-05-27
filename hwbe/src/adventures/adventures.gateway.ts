import { HwDungeonTransformData } from '@hw/shared/dungeon';
import { AdventuresDownstream, AdventuresUpstream } from '@hw/shared/sockets';
import { HwUser } from '@hw/shared/users';
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
import { CurrentMasterWs } from './ws-decorators/current-master.ws-decorator.js';
import { SetAdventureMasterWsGuard } from './ws-guards/set-adventure-master.ws-guard.js';

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

  @UseGuards(SetAdventureMasterWsGuard)
  @SubscribeMessage<keyof AdventuresUpstream>('upSelectMonster')
  public async handleUpOnline(
    @MessageBody() data: AdventuresUpstream['upSelectMonster'],
    @ConnectedSocket() socket: AdventuresSocket,
    @CurrentMasterWs() master: HwUser,
  ): Promise<void> {
    console.log(data);
    console.log(master);
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
