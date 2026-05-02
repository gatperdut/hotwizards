import { HwRequest } from '@hw/hwbe/auth/types/request.type.js';
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import {
  CampaignHwRelations,
  campaignToHwCampaign,
} from '../../campaigns/campaign-to-hw-campaign.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SetMembershipCampaignGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const membership = request.membership;

    const campaign = await this.prismaService.campaign.findFirst({
      where: {
        id: membership.campaignId,
      },
      ...CampaignHwRelations,
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    request.campaign = campaignToHwCampaign(campaign, user.id);

    return true;
  }
}
