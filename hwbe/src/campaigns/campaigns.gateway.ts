// presence/presence.gateway.ts
import { CampaignsDownstream, CampaignsUpstream } from '@hw/shared';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { PresenceService } from '../presence/presence.service.js';
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

type CampaignsSocket = Socket<CampaignsUpstream, CampaignsDownstream>;

@WebSocketGateway({ namespace: 'campaigns' })
export class CampaignsGateway implements OnGatewayInit {
  @WebSocketServer() private readonly server: Server<CampaignsUpstream, CampaignsDownstream>;

  constructor(
    private readonly authService: AuthService,
    private readonly presenceService: PresenceService,
  ) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  public handleDownCreateCampaign(campaignId: number, masterId: number): void {
    console.log('HEYA');
    const sessions = this.presenceService.sessions.get(masterId);
    console.log(sessions);
    sessions?.forEach((session: CampaignsSocket) => session.emit('downCreateCampaign', campaignId));
  }

  public handleDownDeleteCampaign(campaignId: number, playerIds: number[]): void {
    // const sessions = this.presenceService.sessions.get(campaign.masterId);
    // sessions?.forEach((session: CampaignsSocket) =>
    //   session.emit('downDeleteCampaign', campaign.id),
    // );
  }
}
