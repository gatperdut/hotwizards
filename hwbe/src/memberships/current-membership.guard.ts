import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { HwRequest } from '../auth/types/hw-request.type.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CurrentMembershipGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;
    const membershipId = parseInt(request.params.membershipId || request.body.membershipId);

    if (!membershipId) {
      return false;
    }

    const membership = await this.prismaService.membership.findFirst({
      where: { id: membershipId, userId: user.id },
    });

    if (!membership) {
      throw new ForbiddenException('Membership not found');
    }

    request.membership = membership;

    return true;
  }
}
