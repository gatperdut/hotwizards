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
import { applySocketAuthMiddleware } from '../sockets/socket-auth.middleware.js';

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
    userIds: number[],
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downCreateMembership', campaignId, userIds);
  }

  public handleDownDeleteMembership(
    campaignId: number,
    membershipId: number,
    playerIds: number[],
  ): void {
    const rooms = playerIds.map((id) => `user:${id}`);

    this.server.to(rooms).emit('downDeleteMembership', campaignId, membershipId);
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
