import { HwCampaign, Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { CampaignWhereInput } from 'hw/prismagen/models.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CampaignsService {
  constructor(private prismaService: PrismaService) {}

  public async search(
    userId: number,
    term: string = '',
    page: number = 0,
    pageSize: number = 10,
  ): Promise<Paginated<HwCampaign>> {
    const where: CampaignWhereInput = {
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
    };

    const campaigns = await this.prismaService.campaign.findMany({
      where: where,
      skip: page * pageSize,
      take: pageSize,
      // orderBy: { name: 'asc' },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    const total: number = await this.prismaService.campaign.count({ where: where });

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

    return {
      items: campaigns.map(
        (campaign): HwCampaign => ({
          id: campaign.id,
          name: campaign.name,
          masterId: campaign.masterId,
          memberIds: campaign.members.map((member) => member.userId),
          membershipIds: memberships.map((membership) => membership.id),
          createdAt: campaign.createdAt,
        }),
      ),
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }
}
