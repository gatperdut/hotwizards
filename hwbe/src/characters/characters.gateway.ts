// presence/presence.gateway.ts
import { HwSlot } from '@hw/shared/inventory';
import { CharactersDownstream, CharactersUpstream } from '@hw/shared/sockets';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applyAuthWsMiddleware } from '../auth/ws-middleware/auth.ws-middleware.js';
import { applyCampaignWsMiddleware } from '../campaigns/campaign.ws-middleware.js';
import { PrismaService } from '../prisma/prisma.service.js';

type CharactersSocket = Socket<CharactersUpstream, CharactersDownstream>;

@WebSocketGateway({ namespace: 'characters' })
export class CharactersGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private server: Server<CharactersUpstream, CharactersDownstream>;

  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  public afterInit(server: Server): void {
    applyAuthWsMiddleware(server, this.authService);
    applyCampaignWsMiddleware(server, this.prismaService);
  }

  public async handleConnection(socket: CharactersSocket): Promise<void> {
    await socket.join(`campaign:${socket.campaignId}:characters`);
  }

  public handleDownEquipItem(
    campaignId: number,
    characterId: number,
    backpackItemId: string,
  ): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downEquipItem', characterId, backpackItemId);
  }

  public handleDownUnequipItem(campaignId: number, characterId: number, slot: HwSlot): void {
    this.server.to(`campaign:${campaignId}:characters`).emit('downUnequipItem', characterId, slot);
  }
}
