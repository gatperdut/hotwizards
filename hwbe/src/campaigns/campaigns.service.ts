import { Movement, Prisma } from '@hw/prismagen/client';
import { HwCampaign, Paginated } from '@hw/shared';
import { Injectable } from '@nestjs/common';
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
    const where: Prisma.CampaignWhereInput = {
      AND: [
        {
          OR: [
            { masterId: userId },
            {
              memberships: {
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
              memberships: {
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
      orderBy: { name: 'asc' },
      include: {
        memberships: {
          select: {
            id: true,
            userId: true,
          },
        },
        ruleset: {
          select: {
            id: true,
          },
        },
      },
    });

    const total: number = await this.prismaService.campaign.count({ where: where });

    return {
      items: campaigns.map(
        (campaign): HwCampaign => ({
          id: campaign.id,
          name: campaign.name,
          masterId: campaign.masterId,
          memberIds: campaign.memberships.map((membership) => membership.userId),
          membershipIds: campaign.memberships.map((membership) => membership.id),
          rulesetId: campaign.ruleset?.id as number,
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

  public create(masterId: number, name: string, aoo: boolean, movement: Movement) {
    return this.prismaService.campaign.create({
      data: {
        name: name,
        masterId: masterId,
        ruleset: {
          create: {
            aoo: aoo,
            movement: movement,
          },
        },
      },
    });
  }
}
