import { Movement, Prisma } from '@hw/prismagen/client';
import { HwCampaign, Paginated } from '@hw/shared';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CampaignHwRelations, campaignToHwCampaign } from './campaign-to-hw-campaign.js';
import { CampaignsGateway } from './campaigns.gateway.js';

@Injectable()
export class CampaignsService {
  constructor(
    private prismaService: PrismaService,
    private campaignsGateway: CampaignsGateway,
  ) {}

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
      ...CampaignHwRelations,
    });

    const total: number = await this.prismaService.campaign.count({ where: where });

    return {
      items: campaigns.map((campaign): HwCampaign => campaignToHwCampaign(campaign, userId)),
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

    this.campaignsGateway.handleDownCreateCampaign(campaign.id, masterId);

    return campaign.id;
  }

  public async update(
    campaign: HwCampaign,
    name: string,
    aoo: boolean,
    movement: Movement,
  ): Promise<number> {
    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: { name: name, ruleset: { update: { aoo: aoo, movement: movement } } },
      include: {
        memberships: true,
      },
    });

    this.campaignsGateway.handleDownUpdateCampaign(campaign.id, [
      campaign.master.id,
      ...campaign.memberships.map((m) => m.user.id),
    ]);

    return campaign.id;
  }

  public async delete(campaign: HwCampaign): Promise<number> {
    await this.prismaService.campaign.delete({
      where: { id: campaign.id },
      include: {
        memberships: true,
      },
    });

    this.campaignsGateway.handleDownDeleteCampaign(campaign.id, [
      campaign.master.id,
      ...campaign.memberships.map((m) => m.user.id),
    ]);

    return campaign.id;
  }

  public async startAdventure(campaign: HwCampaign, adventureTemplateId: number): Promise<number> {
    const pendingMemberships = campaign.memberships.filter((m) => m.status === 'PENDING');

    if (pendingMemberships.length) {
      throw new ConflictException('There are pending memberships');
    }

    const adventure = await this.prismaService.adventure.create({
      data: {
        campaignId: campaign.id,
        templateId: adventureTemplateId,
      },
      include: {
        template: true,
      },
    });

    this.campaignsGateway.handleDownStartAdventure(
      campaign.id,
      [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)],
      adventure.template.name,
    );

    return adventure.id;
  }

  public async finishAdventure(campaign: HwCampaign): Promise<number> {
    const adventure = await this.prismaService.adventure.delete({
      where: { campaignId: campaign.id },
      include: { template: true },
    });

    this.campaignsGateway.handleDownFinishAdventure(
      campaign.id,
      [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)],
      adventure.template.name,
    );

    return adventure.id;
  }
}
