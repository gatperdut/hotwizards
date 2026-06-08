// presence/presence.gateway.ts
import { HwItem, HwSlot } from '@hw/shared/inventory';
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
    void applyAuthWsMiddleware(server, this.authService, this.prismaService, true);
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

  public handleDownDropItem(campaignId: number, characterId: number, backpackItemId: string): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downDropItem', characterId, backpackItemId);
  }

  public handleDownPickupItem(campaignId: number, characterId: number, stashItemId: string): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downPickupItem', characterId, stashItemId);
  }

  public handleDownPickupGold(campaignId: number, characterId: number, amount: number): void {
    this.server.to(`campaign:${campaignId}:characters`).emit('downPickupGold', characterId, amount);
  }

  public handleDownBuyItem(campaignId: number, characterId: number, boughtItem: HwItem): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downBuyItem', characterId, boughtItem);
  }

  public handleDownSellItem(campaignId: number, characterId: number, soldItemId: string): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downSellItem', characterId, soldItemId);
  }

  public handleDownGiveGold(
    campaignId: number,
    characterId: number,
    targetCharacterId: number,
    amount: number,
  ): void {
    this.server
      .to(`campaign:${campaignId}:characters`)
      .emit('downGiveGold', characterId, targetCharacterId, amount);
  }
}
