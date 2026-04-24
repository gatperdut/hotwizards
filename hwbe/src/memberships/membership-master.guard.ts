import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MembershipMasterGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const membershipId = parseInt(
      request.query?.membershipId || request.params?.membershipId || request.body?.membershipId,
    );

    if (!membershipId) {
      return false;
    }

    const membership = await this.prismaService.membership.findFirst({
      where: { id: membershipId, campaign: { masterId: user.id } },
    });

    if (!membership) {
      return false;
    }

    request.membership = membership;

    return true;
  }
}
