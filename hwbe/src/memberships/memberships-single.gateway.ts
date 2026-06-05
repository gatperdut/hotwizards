import { HwCampaign } from '@hw/shared/campaigns';
import { MembershipsSingleDownstream, MembershipsSingleUpstream } from '@hw/shared/sockets';
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

type MembershipsSocket = Socket<MembershipsSingleUpstream, MembershipsSingleDownstream>;

@WebSocketGateway({ namespace: 'memberships-single' })
export class MembershipsSingleGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private server: Server<MembershipsSingleUpstream, MembershipsSingleDownstream>;

  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  public afterInit(server: Server): void {
    void applyAuthWsMiddleware(server, this.authService, this.prismaService, true);
  }

  public async handleConnection(socket: MembershipsSocket): Promise<void> {
    await socket.join(`campaigns:${socket.campaignId}:memberships`);
  }

  public handleDownCreateMemberships(campaignId: number, membershipIds: number[]): void {
    this.server
      .to(`campaigns:${campaignId}:memberships`)
      .emit('downCreateMemberships', membershipIds);
  }

  public handleDownAbandonMembership(campaign: HwCampaign, memberName: string): void {
    this.server
      .to(`campaigns:${campaign.id}:memberships`)
      .emit('downAbandonMembership', memberName);
  }

  public handleDownKickoutMembership(
    campaign: HwCampaign,
    campaignName: string,
    masterHandle: string,
  ): void {
    this.server
      .to(`campaigns:${campaign.id}:memberships`)
      .emit('downKickoutMembership', campaignName, masterHandle);
  }

  public handleDownUpdateMembership(campaignId: number, membershipId: number): void {
    this.server
      .to(`campaigns:${campaignId}:memberships`)
      .emit('downUpdateMembership', membershipId);
  }
}
