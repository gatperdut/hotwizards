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
