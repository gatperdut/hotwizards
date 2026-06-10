import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { characterPortrait } from '@hw/shared/characters';
import { Direction, DirectionOffsets } from '@hw/shared/directions';
import {
  cellAt,
  cellIsTraversable,
  cellsUpdateLos,
  creatureMovementPoints,
  HwHero,
  HwMonster,
  HwTransformEndTurnMaster,
  sameCell,
} from '@hw/shared/dungeon';
import {
  ClosedDoorSpritePath,
  ClosedToOpenDoorSpritePaths,
  heroSpritePath,
  monsterSpritePath,
} from '@hw/shared/sprites';
import { HwUser } from '@hw/shared/users';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InputJsonValue } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from '../push/push.service.js';
import { AdventuresGateway } from './adventures.gateway.js';

@Injectable()
export class AdventuresService {
  constructor(
    private prismaService: PrismaService,
    private adventuresGateway: AdventuresGateway,
    private pushService: PushService,
    private configService: ConfigService,
  ) {}

  public async finishAdventure(adventure: HwAdventure): Promise<number> {
    await this.prismaService.adventure.delete({
      where: { id: adventure.id },
    });

    this.adventuresGateway.handleDownFinishAdventure(adventure.campaignId);

    return adventure.id;
  }

  private endTurnPush(campaign: HwCampaign, turn: number): void {
    const character = turn === 0 ? null : campaign.memberships[turn - 1].character!;
    const user = turn === 0 ? campaign.master : campaign.memberships[turn - 1].user;
    const name = turn === 0 ? 'Zargon' : character!.name;

    const icon =
      turn === 0
        ? '/portraits/zargon.png'
        : `${characterPortrait(character!.klass, character!.gender)}`;

    void this.pushService.notifyUser(user.id, {
      title: campaign.name,
      body: `${name}, it's your turn`,
      icon: icon,
      url: `${this.configService.get('HWBE_CORS_ORIGIN')}/home/campaigns/${campaign.id}`,
    });
  }

  public async endTurnMaster(campaign: HwCampaign, adventure: HwAdventure): Promise<number> {
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    const wsData: HwTransformEndTurnMaster = {
      monsters: {},
    };
    const updatedMonsters = adventure.dungeon.monsters.map((m) => {
      const movementPoints = creatureMovementPoints(
        m.type!,
        m.inventory,
        campaign.ruleset.movement,
      );
      wsData.monsters[m.id] = { movementPoints: movementPoints };
      return { ...m, movementPoints: movementPoints, maxMovementPoints: movementPoints };
    });

    await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        turn: turn,
        dungeon: {
          ...adventure.dungeon,
          monsters: updatedMonsters,
        } as unknown as InputJsonValue,
      },
    });

    this.endTurnPush(campaign, turn);

    this.adventuresGateway.handleDownEndTurnMaster(campaign.id, wsData);

    return turn;
  }

  public async endTurnHero(
    user: HwUser,
    campaign: HwCampaign,
    adventure: HwAdventure,
  ): Promise<number> {
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    const hero = adventure.dungeon.heroes.find((h) => h.id === user.id)!;

    const movementPoints = creatureMovementPoints(
      hero.klass,
      hero.inventory,
      campaign.ruleset.movement,
    );

    const updatedHero = {
      ...hero,
      movementPoints: movementPoints,
      maxMovementPoints: movementPoints,
    };

    await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        turn: turn,
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) => (h.id === user.id ? updatedHero : h)),
        } as unknown as InputJsonValue,
      },
    });

    this.endTurnPush(campaign, turn);

    this.adventuresGateway.handleDownEndTurnHero(campaign.id, {
      heroId: updatedHero.id,
      movementPoints: movementPoints,
      turn: turn,
    });

    return turn;
  }

  public async moveHero(
    campaign: HwCampaign,
    adventure: HwAdventure,
    hero: HwHero,
    direction: Direction,
  ): Promise<void> {
    if (hero.movementPoints < 1) {
      throw new UnprocessableEntityException('No movement points left');
    }

    const currentCell = cellAt(adventure.dungeon.cells, hero.x, hero.y)!;

    const targetCell = cellAt(
      adventure.dungeon.cells,
      hero.x + DirectionOffsets[direction].x,
      hero.y + DirectionOffsets[direction].y,
    );

    if (!targetCell || !cellIsTraversable(targetCell)) {
      throw new UnprocessableEntityException('The cell cannot be walked into');
    }

    adventure.dungeon.cells = adventure.dungeon.cells.map((cell) => {
      if (sameCell(currentCell, cell)) {
        return {
          ...currentCell,
          creatureId: null,
        };
      }

      if (sameCell(targetCell, cell)) {
        return {
          ...targetCell,
          creatureId: hero.id,
        };
      }

      return cell;
    });

    adventure.dungeon.heroes = adventure.dungeon.heroes.map((h) => {
      if (hero.id !== h.id) {
        return h;
      }

      return {
        ...h,
        spritePath: heroSpritePath(h.klass, h.gender, direction),
        x: targetCell.x,
        y: targetCell.y,
        direction: direction,
        movementPoints: h.movementPoints - 1,
      };
    });

    cellsUpdateLos(
      adventure.dungeon.cells,
      adventure.dungeon.heroes.map((h) => cellAt(adventure.dungeon.cells, h.x, h.y)!),
    );

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: { update: { dungeon: adventure.dungeon as unknown as InputJsonValue } },
      },
    });

    this.adventuresGateway.handleDownMoveHero(campaign.id, {
      heroId: hero.id,
      dir: direction,
      cell: { x: targetCell.x, y: targetCell.y },
    });
  }

  public async moveMonster(
    campaign: HwCampaign,
    adventure: HwAdventure,
    monster: HwMonster,
    direction: Direction,
  ): Promise<void> {
    if (monster.movementPoints < 1) {
      throw new UnprocessableEntityException('No movement points left');
    }

    const currentCell = cellAt(adventure.dungeon.cells, monster.x, monster.y)!;

    const targetCell = cellAt(
      adventure.dungeon.cells,
      monster.x + DirectionOffsets[direction].x,
      monster.y + DirectionOffsets[direction].y,
    );

    if (!targetCell || !cellIsTraversable(targetCell)) {
      throw new UnprocessableEntityException('The cell cannot be walked into');
    }

    adventure.dungeon.cells = adventure.dungeon.cells.map((cell) => {
      if (sameCell(currentCell, cell)) {
        return {
          ...currentCell,
          creatureId: null,
        };
      }

      if (sameCell(targetCell, cell)) {
        return {
          ...targetCell,
          creatureId: monster.id,
        };
      }

      return cell;
    });

    adventure.dungeon.monsters = adventure.dungeon.monsters.map((m) => {
      if (m.id !== monster.id) {
        return m;
      }

      return {
        ...m,
        spritePath: monsterSpritePath(m.type!, direction),
        x: targetCell.x,
        y: targetCell.y,
        direction: direction,
        movementPoints: m.movementPoints - 1,
      };
    });

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: { update: { dungeon: adventure.dungeon as unknown as InputJsonValue } },
      },
    });

    this.adventuresGateway.handleDownMoveMonster(campaign.id, {
      monsterId: monster.id,
      dir: direction,
      cell: { x: targetCell.x, y: targetCell.y },
    });
  }

  public async openDoor(
    campaign: HwCampaign,
    adventure: HwAdventure,
    hero: HwHero,
    direction: Direction,
  ): Promise<void> {
    if (hero.movementPoints < 1) {
      throw new UnprocessableEntityException('No movement points left');
    }

    const targetCell = cellAt(
      adventure.dungeon.cells,
      hero.x + DirectionOffsets[direction].x,
      hero.y + DirectionOffsets[direction].y,
    );

    if (!targetCell || !targetCell.door || targetCell.door.open) {
      throw new UnprocessableEntityException('There is no door to open');
    }

    adventure.dungeon.cells = adventure.dungeon.cells.map((cell) => {
      if (sameCell(targetCell, cell)) {
        return {
          ...targetCell,
          door: {
            ...targetCell.door!,
            spritePath:
              ClosedToOpenDoorSpritePaths[targetCell.door!.spritePath as ClosedDoorSpritePath],
            open: true,
          },
        };
      }

      return cell;
    });

    adventure.dungeon.heroes = adventure.dungeon.heroes.map((h) => {
      if (hero.id !== h.id) {
        return h;
      }

      return {
        ...h,
        direction: direction,
        movementPoints: h.movementPoints - 1,
      };
    });

    cellsUpdateLos(
      adventure.dungeon.cells,
      adventure.dungeon.heroes.map((h) => cellAt(adventure.dungeon.cells, h.x, h.y)!),
    );

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: { update: { dungeon: adventure.dungeon as unknown as InputJsonValue } },
      },
    });

    this.adventuresGateway.handleDownOpenDoor(campaign.id, {
      heroId: hero.id,
      dir: direction,
    });
  }
}
