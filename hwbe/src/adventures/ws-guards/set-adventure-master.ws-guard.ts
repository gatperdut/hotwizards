import { userToHwUser } from '@hw/hwbe/users/user-to-hw-user.js';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CampaignHwRelations } from '../../campaigns/campaign-to-hw-campaign.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SetAdventureMasterWsGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToWs().getClient<Socket>();
    const user = request.user;
    const adventure = request.adventure;

    const campaign = await this.prismaService.campaign.findFirst({
      where: {
        id: adventure.campaignId,
      },
      ...CampaignHwRelations,
    });

    if (campaign!.masterId !== user.id) {
      throw new NotFoundException('You are not the master of campaign');
    }

    request.master = userToHwUser(campaign!.master, user.id);

    return true;
  }
}
