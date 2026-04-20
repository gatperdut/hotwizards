import { HwMembership } from '@hw/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MembershipSelect } from './membership.select.js';

@Injectable()
export class MembershipsService {
  constructor(private prismaService: PrismaService) {}

  public byIds(ids: number[]): Promise<HwMembership[]> {
    return this.prismaService.membership.findMany({
      where: { id: { in: ids } },
      select: MembershipSelect,
    });
  }

  public async invite(campaignId: number, userIds: number[]) {
    const existingUsers = await this.prismaService.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (existingUsers.length !== userIds.length) {
      throw new BadRequestException('One or more user ids do not exist');
    }

    const currentMembers = await this.prismaService.membership.findMany({
      where: { campaignId: campaignId, userId: { in: userIds } },
      select: { id: true },
    });

    if (currentMembers.length) {
      throw new BadRequestException(`Users ${currentMembers.join(', ')} are already members`);
    }

    return this.prismaService.membership.createMany({
      data: userIds.map((userId) => ({
        userId: userId,
        campaignId: campaignId,
        status: 'PENDING',
      })),
    });
  }
}
