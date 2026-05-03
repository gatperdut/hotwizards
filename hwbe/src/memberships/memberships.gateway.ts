// presence/presence.gateway.ts
import { MembershipsDownstream, MembershipsUpstream } from '@hw/shared';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { applySocketAuthMiddleware } from '../auth/middleware/socket-auth.middleware.js';

type MembershipsSocket = Socket<MembershipsUpstream, MembershipsDownstream>;

@WebSocketGateway({ namespace: 'memberships' })
export class MembershipsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<MembershipsUpstream, MembershipsDownstream>;

  constructor(private readonly authService: AuthService) {}

  public afterInit(server: Server): void {
    applySocketAuthMiddleware(server, this.authService);
  }

  public async handleConnection(socket: MembershipsSocket): Promise<void> {
    await socket.join(`user:${socket.user.id}`);
  }

  public handleDownCreateMembership(
    campaignId: number,
    membershipIds: number[],
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downCreateMembership', campaignId, membershipIds);
  }

  public handleDownAbandonMembership(
    campaignId: number,
    memberName: string,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downAbandonMembership', campaignId, memberName);
  }

  public handleDownKickoutMembership(
    campaignId: number,
    campaignName: string,
    masterHandle: string,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downKickoutMembership', campaignId, campaignName, masterHandle);
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
