import { HwCampaign } from '@hw/shared/campaigns';
import { MembershipsAllDownstream, MembershipsAllUpstream } from '@hw/shared/sockets';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applyAuthWsMiddleware } from '../auth/ws-middleware/auth.ws-middleware.js';

type MembershipsSocket = Socket<MembershipsAllUpstream, MembershipsAllDownstream>;

@WebSocketGateway({ namespace: 'memberships-all' })
export class MembershipsAllGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<
    MembershipsAllUpstream,
    MembershipsAllDownstream
  >;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applyAuthWsMiddleware(server, this.authService);
  }

  public async handleConnection(socket: MembershipsSocket): Promise<void> {
    await socket.join(`user:${socket.user.id}`);
  }

  public handleDownCreateMemberships(
    campaign: HwCampaign,
    userIds: number[],
    membershipIds: number[],
  ): void {
    this.server
      .to(this.rooms(campaign, ...userIds))
      .emit('downCreateMemberships', campaign.id, membershipIds);
  }

  public handleDownAbandonMembership(campaign: HwCampaign, memberName: string): void {
    this.server.to(this.rooms(campaign)).emit('downAbandonMembership', campaign.id, memberName);
  }

  public handleDownKickoutMembership(
    campaign: HwCampaign,
    campaignName: string,
    masterHandle: string,
  ): void {
    this.server
      .to(this.rooms(campaign))
      .emit('downKickoutMembership', campaign.id, campaignName, masterHandle);
  }

  public handleDownUpdateMembership(campaign: HwCampaign, membershipId: number): void {
    this.server.to(this.rooms(campaign)).emit('downUpdateMembership', campaign.id, membershipId);
  }

  private rooms(campaign: HwCampaign, ...userIds: number[]): string[] {
    const playerIds = [
      campaign.master.id,
      ...campaign.memberships.map((m) => m.user.id),
      ...userIds,
    ];

    return playerIds.map((id) => `user:${id}`);
  }
}
