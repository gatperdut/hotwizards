import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CampaignUserGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

    const campaignId = parseInt(
      request.query?.campaignId || request.params?.campaignId || request.body?.campaignId,
    );

    if (!campaignId) {
      return false;
    }

    const campaign = await this.prismaService.campaign.findFirst({
      where: {
        AND: [
          { id: campaignId },
          {
            OR: [
              { masterId: user.id },
              {
                memberships: {
                  some: { userId: user.id },
                },
              },
            ],
          },
        ],
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    request.campaign = campaign;

    return true;
  }
}
