import { Character, Gender, Klass, MembershipStatus } from '@hw/prismagen/client';
import { HwCampaign, HwMembership } from '@hw/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from '../push/push.service.js';
import { MembershipsGateway } from './memberships.gateway.js';

@Injectable()
export class MembershipsService {
  constructor(
    private prismaService: PrismaService,
    private membershipsGateway: MembershipsGateway,
    private pushService: PushService,
  ) {}

  public async create(campaign: HwCampaign, userIds: number[]): Promise<number[]> {
    if (userIds.includes(campaign.master.id)) {
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
      where: { campaignId: campaign.id, userId: { in: userIds } },
      select: { id: true },
    });

    if (currentMembers.length) {
      throw new BadRequestException(
        `Users ${currentMembers.map((m) => m.id).join(', ')} are already members`,
      );
    }

    const memberships = await this.prismaService.membership.createManyAndReturn({
      data: userIds.map((userId) => ({
        userId: userId,
        campaignId: campaign.id,
        status: 'PENDING',
      })),
    });

    const membershipIds = memberships.map((membership) => membership.id);

    this.membershipsGateway.handleDownCreateMembership(campaign.id, membershipIds, [
      campaign.master.id,
      ...campaign.memberships.map((m) => m.user.id),
      ...memberships.map((m) => m.userId),
    ]);

    memberships.forEach((m) => {
      void this.pushService.notifyUser(m.userId, {
        notification: {
          title: 'Hot Wizards',
          body: `${campaign.master.handle} has invited you to the campaign ${campaign.name}`,
          // TODO use term param when the frontend supports it
          data: { url: `/home/campaigns` },
        },
      });
    });

    return membershipIds;
  }

  public async accept(
    membership: HwMembership,
    klass: Klass,
    gender: Gender,
    name: string,
  ): Promise<number> {
    let character: Character | undefined;

    await this.prismaService.$transaction(async (tx) => {
      await tx.membership.update({
        where: { id: membership.id },
        data: { status: MembershipStatus.ACTIVE },
      });

      character = await tx.character.create({
        data: {
          name: name,
          klass: klass,
          gender: gender,
          membershipId: membership.id,
        },
      });
    });

    if (!character) {
      throw new NotFoundException('Character could not be created');
    }

    const campaign = await this.prismaService.campaign.findUnique({
      where: { id: membership.campaignId },
      include: { memberships: true },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign could not be found');
    }

    this.membershipsGateway.handleDownUpdateMembership(campaign.id, membership.id, [
      campaign.masterId,
      ...campaign!.memberships.map((m) => m.userId),
    ]);

    void this.pushService.notifyUser(campaign.masterId, {
      notification: {
        title: 'Hot Wizards',
        body: `${membership.user.handle} has accepted the invitation to your campaign ${campaign.name}`,
        // TODO use term param when the frontend supports it
        data: { url: `/home/campaigns` },
      },
    });

    return character.id;
  }

  public async delete(
    campaign: HwCampaign,
    membership: HwMembership,
    self: boolean,
  ): Promise<number> {
    const playerIds = [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)];

    await this.prismaService.membership.delete({
      where: { id: membership.id },
    });

    if (self) {
      this.membershipsGateway.handleDownAbandonMembership(
        campaign.id,
        membership.user.handle,
        playerIds,
      );
    } else {
      this.membershipsGateway.handleDownKickoutMembership(
        campaign.id,
        campaign.name,
        campaign.master.handle,
        playerIds,
      );
    }

    void this.pushService.notifyUser(self ? campaign.master.id : membership.userId, {
      notification: {
        title: 'Hot Wizards',
        body: self
          ? `${membership.user.handle} has left your campaign ${campaign.name}`
          : `${campaign.master.handle} has kicked you out of the campaign ${campaign.name}`,
        // TODO use term param when the frontend supports it
        data: { url: `/home/campaigns` },
      },
    });

    return membership.id;
  }
}
