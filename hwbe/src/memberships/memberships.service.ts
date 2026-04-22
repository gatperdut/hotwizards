import { Gender, Klass, MembershipStatus } from '@hw/prismagen/client';
import { HwMembership } from '@hw/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MembershipsService {
  constructor(private prismaService: PrismaService) {}

  public async byIds(ids: number[]): Promise<HwMembership[]> {
    const memberships = await this.prismaService.membership.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        userId: true,
        campaignId: true,
        status: true,
        joinedAt: true,
        character: {
          select: {
            id: true,
          },
        },
      },
    });

    return memberships.map(({ character, ...m }) => ({
      ...m,
      characterId: character?.id ?? undefined,
    }));
  }

  public async invite(campaignId: number, masterId: number, userIds: number[]) {
    if (userIds.includes(masterId)) {
      throw new BadRequestException('You cannot invite yourself to your own campaign');
    }

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

  public async accept(membershipId: number, klass: Klass, gender: Gender, name: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const membership = await tx.membership.update({
        where: { id: membershipId },
        data: { status: MembershipStatus.ACTIVE },
      });

      const character = await tx.character.create({
        data: {
          name: name,
          klass: klass,
          gender: gender,
          membershipId: membership.id,
        },
      });

      return {
        membership: membership,
        character: character,
      };
    });
  }
}
