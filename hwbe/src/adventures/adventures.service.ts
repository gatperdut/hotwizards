import { HwAdventure, HwCampaign, HwUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KlassesService } from '../characters/klasses.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from '../push/push.service.js';
import { AdventuresGateway } from './adventures.gateway.js';

@Injectable()
export class AdventuresService {
  constructor(
    private prismaService: PrismaService,
    private adventuresGateway: AdventuresGateway,
    private pushService: PushService,
    private klassesService: KlassesService,
    private configService: ConfigService,
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

    const character = campaign.memberships[turn - 1].character!;

    const name = turn === 0 ? 'Zargon' : character!.name;

    const icon =
      turn === 0
        ? '/characters/zargon.png'
        : `${this.klassesService.portrait(character.klass, character.gender)}`;

    void this.pushService.notifyUser(user.id, {
      title: campaign.name,
      body: `${name}, it's your turn`,
      icon: icon,
      url: `${this.configService.get('HWBE_CORS_ORIGIN')}/home/campaigns/${campaign.id}`,
    });

    return turn;
  }
}
