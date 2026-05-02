import { HwAdventure, HwCampaign } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdventuresGateway } from './adventures.gateway.js';

@Injectable()
export class AdventuresService {
  constructor(
    private prismaService: PrismaService,
    private adventuresGateway: AdventuresGateway,
  ) {}

  public async finishAdventure(campaign: HwCampaign, adventure: HwAdventure): Promise<number> {
    await this.prismaService.adventure.delete({
      where: { id: adventure.id },
    });

    this.adventuresGateway.handleDownFinishAdventure(
      campaign.id,
      [campaign.master.id, ...campaign.memberships.map((m) => m.user.id)],
      adventure.template.name,
    );

    return adventure.id;
  }
}
