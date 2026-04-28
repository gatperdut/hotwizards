// presence/presence.gateway.ts
import { CampaignsDownstream, CampaignsUpstream } from '@hw/shared';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

type CampaignsSocket = Socket<CampaignsUpstream, CampaignsDownstream>;

@WebSocketGateway({ namespace: 'campaigns' })
export class CampaignsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<CampaignsUpstream, CampaignsDownstream>;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  public async handleConnection(socket: CampaignsSocket): Promise<void> {
    await socket.join(`user:${socket.user.id}`);
  }

  public handleDownCreateCampaign(campaignId: number, masterId: number): void {
    this.server.to(`user:${masterId}`).emit('downCreateCampaign', campaignId);
  }

  public handleDownDeleteCampaign(campaignId: number, playerIds: number[]): void {}
}
