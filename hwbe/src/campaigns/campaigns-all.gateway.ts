import { HwCampaign } from '@hw/shared/campaigns';
import { CampaignsAllDownstream, CampaignsAllUpstream } from '@hw/shared/sockets';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applyAuthWsMiddleware } from '../auth/ws-middleware/auth.ws-middleware.js';

type CampaignsSocket = Socket<CampaignsAllUpstream, CampaignsAllDownstream>;

@WebSocketGateway({ namespace: 'campaigns-all' })
export class CampaignsAllGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<CampaignsAllUpstream, CampaignsAllDownstream>;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applyAuthWsMiddleware(server, this.authService);
  }

  public async handleConnection(socket: CampaignsSocket): Promise<void> {
    await socket.join(`user:${socket.user.id}`);
  }

  public handleDownCreateCampaign(campaignId: number, masterId: number): void {
    this.server.to(`user:${masterId}`).emit('downCreateCampaign', campaignId);
  }

  public handleDownDeleteCampaign(campaign: HwCampaign): void {
    this.server.to(this.rooms(campaign)).emit('downDeleteCampaign', campaign.id);
  }

  public handleDownUpdateCampaign(campaign: HwCampaign): void {
    this.server.to(this.rooms(campaign)).emit('downUpdateCampaign', campaign.id);
  }

  private rooms(campaign: HwCampaign): string[] {
    const playerIds = [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)];

    return playerIds.map((id) => `user:${id}`);
  }
}
