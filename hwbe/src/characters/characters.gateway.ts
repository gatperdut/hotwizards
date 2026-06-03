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
import { applySocketAuthMiddleware } from '../auth/middleware/socket-auth.middleware.js';

type CharactersSocket = Socket<CharactersUpstream, CharactersDownstream>;

@WebSocketGateway({ namespace: 'characters' })
export class CharactersGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<CharactersUpstream, CharactersDownstream>;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  public async handleConnection(socket: CharactersSocket): Promise<void> {
    await socket.join(`campaign:${socket.handshake.auth.campaignId}`);
  }

  public handleDownEquipItem(
    campaignId: number,
    characterId: number,
    backpackItemId: string,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server
      .to(`campaign:${campaignId}`)
      .emit('downEquipItem', campaignId, characterId, backpackItemId);
  }

  public handleDownUnequipItem(
    campaignId: number,
    characterId: number,
    slot: HwSlot,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(`campaign:${campaignId}`).emit('downUnequipItem', campaignId, characterId, slot);
  }
}
