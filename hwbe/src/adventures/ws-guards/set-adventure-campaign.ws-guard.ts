import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  CampaignHwRelations,
  campaignToHwCampaign,
} from '../../campaigns/campaign-to-hw-campaign.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SetAdventureCampaignWsGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToWs().getClient<Socket>();
    const user = request.user;
    const adventure = request.adventure;

    const campaign = await this.prismaService.campaign.findFirst({
      where: {
        id: adventure.campaignId,
        OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }],
      },
      ...CampaignHwRelations,
    });

    if (!campaign) {
      throw new WsException('Campaign not found');
    }

    request.campaign = campaignToHwCampaign(campaign, user.id);

    return true;
  }
}
