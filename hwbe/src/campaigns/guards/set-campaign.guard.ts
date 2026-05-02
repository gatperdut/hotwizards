import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CampaignHwRelations, campaignToHwCampaign } from '../campaign-to-hw-campaign.js';

@Injectable()
export class SetCampaignGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

    const paramsCampaignId = request.params?.campaignId;
    if (!paramsCampaignId || Array.isArray(paramsCampaignId)) {
      return false;
    }
    const campaignId = parseInt(paramsCampaignId);
    if (typeof campaignId !== 'number' || Number.isNaN(campaignId)) {
      return false;
    }

    const campaign = await this.prismaService.campaign.findFirst({
      where: {
        id: campaignId,
        OR: [{ masterId: user.id }, { memberships: { some: { userId: user.id } } }],
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
