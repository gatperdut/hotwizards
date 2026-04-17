import { HwCampaign } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CampaignsService {
  constructor(private prismaService: PrismaService) {}

  public async search(userId: number): Promise<HwCampaign[]> {
    const campaigns = await this.prismaService.campaign.findMany({
      where: {
        OR: [
          { masterId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
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
      // select: {
      //   id: true,
      //   name: true,
      //   masterId: true,
      //   createdAt: true,
      //   members: {
      //     select: {
      //       userId: true,
      //     },
      //   },
      // },
    });

    return campaigns.map(
      (campaign): HwCampaign => ({
        id: campaign.id,
        name: campaign.name,
        masterId: campaign.masterId,
        memberIds: campaign.members.map((member) => member.userId),
        createdAt: campaign.createdAt,
      }),
    );
  }
}
