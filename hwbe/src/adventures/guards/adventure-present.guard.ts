import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdventurePresent implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const campaign = request.campaign;
    const membership = request.membership;

    const campaignId = campaign?.id || membership?.campaignId;

    if (!campaignId) {
      throw new NotFoundException('Campaign not found');
    }

    const adventure = await this.prismaService.adventure.findUnique({
      where: { campaignId: campaignId },
    });

    if (!adventure) {
      throw new NotFoundException('The campaign is not running an adventure');
    }

    return true;
  }
}
