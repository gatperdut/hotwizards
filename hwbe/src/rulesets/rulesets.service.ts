import { Injectable } from '@nestjs/common';
import { HwRuleset } from '../../../shared/dist/shared/src/rulesets/ruleset.interface.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RulesetsService {
  constructor(private prismaService: PrismaService) {}

  public async byIds(ids: number[]): Promise<HwRuleset[]> {
    const rulesets = await this.prismaService.ruleset.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        campaignId: true,
        aoo: true,
        movement: true,
      },
    });

    return rulesets;
  }
}
