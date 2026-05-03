import { HwAdventure, HwCampaign, HwUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from '../push/push.service.js';
import { AdventuresGateway } from './adventures.gateway.js';

@Injectable()
export class AdventuresService {
  constructor(
    private prismaService: PrismaService,
    private adventuresGateway: AdventuresGateway,
    private pushService: PushService,
  ) {}

  public async finishAdventure(campaign: HwCampaign, adventure: HwAdventure): Promise<number> {
    await this.prismaService.adventure.delete({
      where: { id: adventure.id },
    });

    this.adventuresGateway.handleDownFinishAdventure(
      campaign.id,
      adventure.id,
      adventure.template.name,
    );

    return adventure.id;
  }

  public async nextTurn(
    user: HwUser,
    campaign: HwCampaign,
    adventure: HwAdventure,
  ): Promise<number> {
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        turn: turn,
      },
    });

    this.adventuresGateway.handleDownNextTurn(campaign.id, adventure.id, turn);

    const name = turn === 0 ? 'Zargon' : campaign.memberships[turn - 1].character!.name;

    void this.pushService.notifyUser(user.id, {
      notification: {
        title: 'Hot Wizards',
        body: `${name}, it's your turn in ${campaign.name}`,
        data: { url: `/home/campaigns/${campaign.id}/board` },
      },
    });

    return turn;
  }
}
