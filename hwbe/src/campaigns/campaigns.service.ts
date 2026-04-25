import { Movement, Prisma, Ruleset } from '@hw/prismagen/client';
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
        master: true,
        memberships: {
          include: {
            user: true,
            character: true,
          },
        },
        ruleset: true,
      },
    });

    const total: number = await this.prismaService.campaign.count({ where: where });

    return {
      items: campaigns.map((campaign): HwCampaign => {
        const ruleset = campaign.ruleset as Ruleset;

        const { password, ...strippedMaster } = campaign.master;

        return {
          id: campaign.id,
          name: campaign.name,
          createdAt: campaign.createdAt,
          master: {
            ...strippedMaster,
            me: campaign.master.id === userId,
          },
          memberships: campaign.memberships.map((membership) => {
            const { password, ...strippedUser } = membership.user;

            return {
              id: membership.id,
              status: membership.status,
              joinedAt: membership.joinedAt,
              me: membership.userId === userId,
              user: { ...strippedUser, me: membership.user.id === userId },
              character: membership.character
                ? { ...membership.character, me: membership.user.id === userId }
                : undefined,
            };
          }),
          ruleset: {
            id: ruleset.id,
            aoo: ruleset.aoo,
            movement: ruleset.movement,
          },
        };
      }),
      meta: {
        page: page || 0,
        pageSize: pageSize || 10,
        total: total,
        pages: Math.ceil(total / (pageSize || 10)),
      },
    };
  }

  public async create(
    masterId: number,
    name: string,
    aoo: boolean,
    movement: Movement,
  ): Promise<number> {
    const campaign = await this.prismaService.campaign.create({
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

    return campaign.id;
  }

  public async update(
    campaignId: number,
    name: string,
    aoo: boolean,
    movement: Movement,
  ): Promise<number> {
    const campaign = await this.prismaService.campaign.update({
      where: { id: campaignId },
      data: { name: name, ruleset: { update: { aoo: aoo, movement: movement } } },
    });

    return campaign.id;
  }

  public async delete(campaignId: number): Promise<number> {
    const campaign = await this.prismaService.campaign.delete({
      where: { id: campaignId },
    });

    return campaign.id;
  }
}
