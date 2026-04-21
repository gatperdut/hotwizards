import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CurrentCampaignGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();

    const campaignId = parseInt(request.params.campaignId || request.body.campaignId);

    if (!campaignId) {
      return false;
    }

    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    request.campaign = campaign;

    return true;
  }
}
