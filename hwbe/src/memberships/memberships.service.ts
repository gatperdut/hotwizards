import { Gender, Klass, MembershipStatus } from '@hw/prismagen/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MembershipsGateway } from './memberships.gateway.js';

@Injectable()
export class MembershipsService {
  constructor(
    private prismaService: PrismaService,
    private membershipsGateway: MembershipsGateway,
  ) {}

  public async create(campaignId: number, masterId: number, userIds: number[]): Promise<number[]> {
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
      throw new BadRequestException(
        `Users ${currentMembers.map((m) => m.id).join(', ')} are already members`,
      );
    }

    await this.prismaService.membership.createManyAndReturn({
      data: userIds.map((userId) => ({
        userId: userId,
        campaignId: campaignId,
        status: 'PENDING',
      })),
    });

    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
      include: { memberships: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    this.membershipsGateway.handleDownCreateMembership(campaignId, [
      masterId,
      ...campaign.memberships.map((m) => m.userId),
    ]);

    return campaign.memberships.map((membership) => membership.id);
  }

  public async accept(
    membershipId: number,
    klass: Klass,
    gender: Gender,
    name: string,
  ): Promise<number> {
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

      return character.id;
    });
  }

  public async delete(campaignId: number, membershipId: number): Promise<number> {
    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: campaignId },
      include: { memberships: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const membership = await this.prismaService.membership.delete({
      where: { id: membershipId },
    });

    this.membershipsGateway.handleDownDeleteMembership(campaign.id, membershipId, [
      campaign.masterId,
      ...campaign!.memberships.map((m) => m.userId),
    ]);

    return membership.id;
  }
}
