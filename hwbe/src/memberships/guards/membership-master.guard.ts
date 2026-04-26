import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MembershipMasterGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const membership = request.membership;

    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: membership.campaignId },
    });

    if (!campaign) {
      return false;
    }

    return campaign.masterId === user.id;
  }
}
