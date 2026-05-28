import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { characterPortrait } from '@hw/shared/characters';
import { Direction, DirectionOffsets } from '@hw/shared/directions';
import { cellIsTraversable, HwCell, HwCreature, HwDungeonTransformData } from '@hw/shared/dungeon';
import { heroSpritePath, monsterSpritePath } from '@hw/shared/sprites';
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

    this.adventuresGateway.handleDownFinishAdventure(adventure.id);

    return adventure.id;
  }

  private endTurnPush(user: HwUser, campaign: HwCampaign, turn: number): void {
    const character = turn === 0 ? null : campaign.memberships[turn - 1].character!;

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

  public async endTurnMaster(
    user: HwUser,
    campaign: HwCampaign,
    adventure: HwAdventure,
  ): Promise<number> {
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    const updatedMonsters = adventure.dungeon.monsters.map((m) => ({
      ...m,
      movementPoints: m.maxMovementPoints,
    }));

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

    this.endTurnPush(user, campaign, turn);

    this.adventuresGateway.handleDownNextTurn(adventure.id, {
      turn: turn,
      modifiedCells: [],
      modifiedCreatures: updatedMonsters,
    });

    return turn;
  }

  public async endTurnHero(
    user: HwUser,
    campaign: HwCampaign,
    adventure: HwAdventure,
  ): Promise<number> {
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    const hero = adventure.dungeon.heroes.find((h) => h.id === user.id)!;

    const updatedHero = { ...hero, movementPoints: hero.maxMovementPoints };

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

    this.endTurnPush(user, campaign, turn);

    this.adventuresGateway.handleDownNextTurn(adventure.id, {
      turn: turn,
      modifiedCells: [],
      modifiedCreatures: [updatedHero],
    });

    return turn;
  }

  private sameCell(cell1: HwCell, cell2: HwCell): boolean {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  private cellAt(adventure: HwAdventure, x: number, y: number): HwCell | undefined {
    return adventure.dungeon.cells.find((cell) => cell.x === x && cell.y === y);
  }

  public async moveCreature(
    campaign: HwCampaign,
    adventure: HwAdventure,
    creature: HwCreature,
    direction: Direction,
  ): Promise<void> {
    if (creature.movementPoints < 1) {
      throw new UnprocessableEntityException('No movement points left');
    }

    const currentCell = this.cellAt(adventure, creature.x, creature.y)!;

    const targetCell = this.cellAt(
      adventure,
      creature.x + DirectionOffsets[direction].x,
      creature.y + DirectionOffsets[direction].y,
    );

    if (!targetCell || !cellIsTraversable(targetCell)) {
      throw new UnprocessableEntityException('The cell cannot be walked into');
    }

    adventure.dungeon.cells = adventure.dungeon.cells.map((cell) => {
      if (this.sameCell(currentCell, cell)) {
        return {
          ...currentCell,
          creatureId: null,
        };
      }

      if (this.sameCell(targetCell, cell)) {
        return {
          ...targetCell,
          creatureId: creature.id,
        };
      }

      return cell;
    });

    if (creature.alignment === 'HERO') {
      adventure.dungeon.heroes = adventure.dungeon.heroes.map((hero) => {
        if (hero.id !== creature.id) {
          return hero;
        }

        return {
          ...hero,
          spritePath: heroSpritePath(hero.klass, hero.gender, direction),
          x: targetCell.x,
          y: targetCell.y,
          direction: direction,
          movementPoints: hero.movementPoints - 1,
        };
      });
    } else {
      adventure.dungeon.monsters = adventure.dungeon.monsters.map((monster) => {
        if (monster.id !== creature.id) {
          return monster;
        }

        return {
          ...monster,
          spritePath: monsterSpritePath(monster.type!, direction),
          x: targetCell.x,
          y: targetCell.y,
          direction: direction,
          movementPoints: monster.movementPoints - 1,
        };
      });
    }

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: { update: { dungeon: adventure.dungeon as unknown as InputJsonValue } },
      },
    });

    const data: HwDungeonTransformData = {
      turn: adventure.turn,
      modifiedCells: adventure.dungeon.cells.filter(
        (c) =>
          (c.x === currentCell.x && c.y === currentCell.y) ||
          (c.x === targetCell.x && c.y === targetCell.y),
      ),
      modifiedCreatures: [
        [...adventure.dungeon.heroes, ...adventure.dungeon.monsters].find(
          (c) => c.id === creature.id,
        )!,
      ],
    };

    this.adventuresGateway.handleDownUpdate(adventure.id, data);
  }
}
