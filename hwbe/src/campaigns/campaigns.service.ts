import { HwCampaign } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CampaignsService {
  constructor(private prismaService: PrismaService) {}

  public async search(userId: number, term: string = ''): Promise<HwCampaign[]> {
    const campaigns = await this.prismaService.campaign.findMany({
      where: {
        AND: [
          {
            OR: [
              { masterId: userId },
              {
                members: {
                  some: { userId: userId },
                },
              },
            ],
          },
          {
            OR: [
              {
                name: {
                  contains: term,
                  mode: 'insensitive',
                },
              },
              {
                master: {
                  handle: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
              },
              {
                members: {
                  some: {
                    user: {
                      handle: {
                        contains: term,
                        mode: 'insensitive',
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    const memberships = await this.prismaService.membership.findMany({
      where: {
        campaignId: { in: campaigns.map((campaign) => campaign.id) },
        userId: {
          in: [
            ...new Set(
              campaigns.flatMap((campaign) => campaign.members.map((member) => member.userId)),
            ),
          ],
        },
      },
    });

    return campaigns.map(
      (campaign): HwCampaign => ({
        id: campaign.id,
        name: campaign.name,
        masterId: campaign.masterId,
        memberIds: campaign.members.map((member) => member.userId),
        membershipIds: memberships.map((membership) => membership.id),
        createdAt: campaign.createdAt,
      }),
    );
  }
}
