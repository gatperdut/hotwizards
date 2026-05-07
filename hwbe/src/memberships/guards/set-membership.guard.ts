import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { HwRequest } from '../../auth/types/request.type.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MembershipHwRelations, membershipToHwMembership } from '../membership-to-hw-membership.js';

@Injectable()
export class SetMembershipGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<HwRequest>();
    const user = request.user;

    const rawMembershipId = request.params?.membershipId;
    if (!rawMembershipId || Array.isArray(rawMembershipId)) {
      return false;
    }
    const membershipId = parseInt(rawMembershipId);
    if (typeof membershipId !== 'number' || Number.isNaN(membershipId)) {
      return false;
    }

    const membership = await this.prismaService.membership.findFirst({
      where: {
        id: membershipId,
        OR: [{ campaign: { masterId: user.id } }, { userId: user.id }],
      },
      ...MembershipHwRelations,
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    request.membership = membershipToHwMembership(membership, user.id);

    return true;
  }
}
