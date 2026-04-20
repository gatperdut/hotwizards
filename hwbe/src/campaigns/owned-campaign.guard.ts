import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class OwnedCampaignGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

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

    if (campaign.masterId !== user.id) {
      throw new ForbiddenException('You are not the master of this campaign');
    }

    request.ownedCampaign = campaign;

    return true;
  }
}
