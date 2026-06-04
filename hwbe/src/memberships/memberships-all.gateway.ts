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
    campaignId: number,
    membershipIds: number[],
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downCreateMemberships', campaignId, membershipIds);
  }

  public handleDownAbandonMembership(campaign: HwCampaign, memberName: string): void {
    const playerIds = [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)];
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downAbandonMembership', campaign.id, memberName);
  }

  public handleDownKickoutMembership(
    campaign: HwCampaign,
    campaignName: string,
    masterHandle: string,
  ): void {
    const playerIds = [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)];
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downKickoutMembership', campaign.id, campaignName, masterHandle);
  }

  public handleDownUpdateMembership(
    campaignId: number,
    membershipId: number,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downUpdateMembership', campaignId, membershipId);
  }
}
