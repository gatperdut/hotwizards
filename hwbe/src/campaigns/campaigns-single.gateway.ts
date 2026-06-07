import { CampaignsSingleDownstream, CampaignsSingleUpstream } from '@hw/shared/sockets';
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

type CampaignsSocket = Socket<CampaignsSingleUpstream, CampaignsSingleDownstream>;

@WebSocketGateway({ namespace: 'campaigns-single' })
export class CampaignsSingleGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() private readonly server: Server<
    CampaignsSingleUpstream,
    CampaignsSingleDownstream
  >;

  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  public afterInit(server: Server): void {
    void applyAuthWsMiddleware(server, this.authService, this.prismaService, true);
  }

  public async handleConnection(socket: CampaignsSocket): Promise<void> {
    await socket.join(`campaigns:${socket.campaignId}`);
  }

  public handleDownDeleteCampaign(campaignId: number): void {
    this.server.to(`campaigns:${campaignId}`).emit('downDeleteCampaign');
  }

  public handleDownUpdateCampaign(campaignId: number): void {
    this.server.to(`campaigns:${campaignId}`).emit('downUpdateCampaign');
  }

  public handleDownStartAdventure(campaignId: number): void {
    this.server.to(`campaigns:${campaignId}`).emit('downStartAdventure');
  }

  public handleDownDropGold(campaignId: number, amount: number): void {
    this.server.to(`campaigns:${campaignId}`).emit('downDropGold', amount);
  }
}
