import { InputJsonValue } from '@hw/prismagen/runtime';
import { HwAdventure } from '@hw/shared/adventures';
import { HwCampaign } from '@hw/shared/campaigns';
import { characterPortrait } from '@hw/shared/characters';
import { Adjacent, AdjacentOffsets } from '@hw/shared/directions';
import {
  cellAt,
  cellIsTraversable,
  cellsUpdateLos,
  creatureMaxActionPoints,
  creatureMovementPoints,
  endTurnHero,
  HwCell,
  HwHero,
  HwMonster,
  HwTransformEndTurnMaster,
  moveHero,
  moveMonster,
  openDoor,
  sameCell,
  searchedCells,
  searchSecondaryCells,
} from '@hw/shared/dungeon';
import { HwItem, HwItemSlots, HwSlot } from '@hw/shared/inventory';
import { HwUser } from '@hw/shared/users';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  public async endTurnMaster(campaign: HwCampaign): Promise<number> {
    const adventure = campaign.adventure!;
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);

    const wsData: HwTransformEndTurnMaster = {
      monsters: {},
    };
    const updatedMonsters = adventure.dungeon.monsters.map((m) => {
      const actionPoints = creatureMaxActionPoints(m.type!, m.inventory);
      const movementPoints = creatureMovementPoints(
        m.type!,
        m.inventory,
        campaign.ruleset.movement,
      );
      wsData.monsters[m.id] = { actionPoints: actionPoints, movementPoints: movementPoints };
      return {
        ...m,
        actionPoints: actionPoints,
        movementPoints: movementPoints,
        maxMovementPoints: movementPoints,
      };
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

  public async endTurnHero(user: HwUser, campaign: HwCampaign): Promise<number> {
    const adventure = campaign.adventure!;
    const turn = (adventure.turn + 1) % (campaign.memberships.length + 1);
    const hero = adventure.dungeon.heroes.find((h) => h.id === user.id)!;

    const actionPoints = creatureMaxActionPoints(hero.klass, hero.inventory);
    const movementPoints = creatureMovementPoints(
      hero.klass,
      hero.inventory,
      campaign.ruleset.movement,
    );

    endTurnHero(adventure.dungeon, user.id, actionPoints, movementPoints);

    await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        turn: turn,
        dungeon: adventure.dungeon as unknown as InputJsonValue,
      },
    });

    this.endTurnPush(campaign, turn);

    this.adventuresGateway.handleDownEndTurnHero(campaign.id, {
      heroId: hero.id,
      actionPoints: actionPoints,
      movementPoints: movementPoints,
      turn: turn,
    });

    return turn;
  }

  public async moveHero(campaign: HwCampaign, hero: HwHero, adjacent: Adjacent): Promise<void> {
    const targetCell = cellAt(
      campaign.adventure!.dungeon.cells,
      hero.x + AdjacentOffsets[adjacent].x,
      hero.y + AdjacentOffsets[adjacent].y,
    );

    if (!targetCell || !cellIsTraversable(targetCell)) {
      throw new UnprocessableEntityException('The cell cannot be walked into');
    }

    moveHero(campaign.adventure!.dungeon, hero.id, adjacent);

    cellsUpdateLos(
      campaign.adventure!.dungeon.cells,
      campaign.adventure!.dungeon.heroes.map((h) =>
        cellAt(campaign.adventure!.dungeon.cells, h.x, h.y)!,
      ),
    );

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: {
          update: { dungeon: campaign.adventure!.dungeon as unknown as InputJsonValue },
        },
      },
    });

    this.adventuresGateway.handleDownMoveHero(campaign.id, {
      heroId: hero.id,
      adj: adjacent,
    });
  }

  public async moveMonster(
    campaign: HwCampaign,
    monster: HwMonster,
    adjacent: Adjacent,
  ): Promise<void> {
    const adventure = campaign.adventure!;

    const targetCell = cellAt(
      adventure.dungeon.cells,
      monster.x + AdjacentOffsets[adjacent].x,
      monster.y + AdjacentOffsets[adjacent].y,
    );
    if (!targetCell || !cellIsTraversable(targetCell)) {
      throw new UnprocessableEntityException('The cell cannot be walked into');
    }

    moveMonster(adventure.dungeon, monster.id, adjacent);

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        adventure: {
          update: {
            dungeon: adventure.dungeon as unknown as InputJsonValue,
          },
        },
      },
    });

    this.adventuresGateway.handleDownMoveMonster(campaign.id, {
      monsterId: monster.id,
      adj: adjacent,
    });
  }

  public async openDoor(campaign: HwCampaign, hero: HwHero, adjacent: Adjacent): Promise<void> {
    const adventure = campaign.adventure!;

    const updatedCells = openDoor(adventure.dungeon.cells, hero.x, hero.y, adjacent);
    if (!updatedCells) {
      throw new UnprocessableEntityException('There is no door to open');
    }

    adventure.dungeon.cells = updatedCells;
    adventure.dungeon.heroes = adventure.dungeon.heroes.map((h) => {
      if (hero.id !== h.id) {
        return h;
      }

      return {
        ...h,
        direction: adjacent,
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
      adj: adjacent,
    });
  }

  public async equipItem(campaign: HwCampaign, hero: HwHero, backpackItem: HwItem): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };

    const slot = HwItemSlots[backpackItem.name];
    if (!slot) {
      throw new UnprocessableEntityException(`Item ${backpackItem.name} cannot be equiped`);
    }

    inventory.gear[slot] = backpackItem;
    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id ? { ...h, inventory, movementPoints: h.movementPoints - 1 } : h,
          ),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownEquipItem(campaign.id, hero.id, backpackItem.id);
  }

  public async unequipItem(campaign: HwCampaign, hero: HwHero, slot: HwSlot): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };

    const item = inventory.gear[slot];
    if (!item) {
      throw new UnprocessableEntityException(`No item equipped in slot ${slot}`);
    }

    inventory.gear[slot] = null;
    inventory.backpack.items.unshift(item);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id ? { ...h, inventory, movementPoints: h.movementPoints - 1 } : h,
          ),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownUnequipItem(campaign.id, hero.id, slot);
  }

  public async dropItem(campaign: HwCampaign, hero: HwHero, backpackItem: HwItem): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };
    const cell = cellAt(adventure.dungeon.cells, hero.x, hero.y)!;
    const loot = { ...cell.loot };

    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id);
    loot.items.push(backpackItem);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id
              ? { ...h, inventory: inventory, movementPoints: h.movementPoints - 1 }
              : h,
          ),
          cells: adventure.dungeon.cells.map((c) => (sameCell(cell, c) ? { ...c, loot: loot } : c)),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownDropItem(campaign.id, hero.id, backpackItem.id);
  }

  public async destroyItem(
    campaign: HwCampaign,
    hero: HwHero,
    backpackItem: HwItem,
  ): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };

    inventory.backpack.items = inventory.backpack.items.filter((i) => i.id !== backpackItem.id);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id
              ? { ...h, inventory: inventory, movementPoints: h.movementPoints - 1 }
              : h,
          ),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownDestroyItem(campaign.id, hero.id, backpackItem.id);
  }

  public async pickupItem(campaign: HwCampaign, hero: HwHero, lootItem: HwItem): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };
    const cell = cellAt(adventure.dungeon.cells, hero.x, hero.y)!;
    const loot = { ...cell.loot };

    loot.items = loot.items.filter((i) => i.id !== lootItem.id);
    inventory.backpack.items.push(lootItem);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id
              ? { ...h, inventory: inventory, movementPoints: h.movementPoints - 1 }
              : h,
          ),
          cells: adventure.dungeon.cells.map((c) => (sameCell(cell, c) ? { ...c, loot: loot } : c)),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownPickupItem(campaign.id, hero.id, lootItem.id);
  }

  public async pickupGold(campaign: HwCampaign, hero: HwHero, amount: number): Promise<void> {
    const adventure = campaign.adventure!;
    const inventory = { ...hero.inventory };
    const cell = cellAt(adventure.dungeon.cells, hero.x, hero.y)!;
    const loot = { ...cell.loot };

    if (loot.gold < amount) {
      throw new UnprocessableEntityException(
        `Cannot take ${amount} gold coins from a loot of ${loot.gold}`,
      );
    }

    loot.gold -= amount;
    inventory.backpack.gold += amount;

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id
              ? { ...h, inventory: inventory, movementPoints: h.movementPoints - 1 }
              : h,
          ),
          cells: adventure.dungeon.cells.map((c) => (sameCell(cell, c) ? { ...c, loot: loot } : c)),
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownPickupGold(campaign.id, hero.id, amount);
  }

  public async search(campaign: HwCampaign, hero: HwHero): Promise<void> {
    const adventure = campaign.adventure!;

    const searchCells = searchedCells(
      adventure.dungeon.cells,
      cellAt(adventure.dungeon.cells, hero.x, hero.y)!,
    );

    const updatedCells = adventure.dungeon.cells.map((c) => {
      const cell = cellAt(searchCells, c.x, c.y);

      if (!cell) {
        return c;
      }

      const updatedC: HwCell = {
        ...c,
        floorTrap: { ...c.floorTrap, found: true },
        searched: true,
        feature: {
          ...c.feature,
          trap: {
            ...c.feature.trap,
            ...(c.feature.trap.spritePath ? { ...c.feature.trap, found: true } : c.feature.trap),
          },
        },
        door: {
          ...c.door,
          trap: {
            ...c.door.trap,
            ...(c.door.trap.spritePath ? { ...c.door.trap, found: true } : c.door.trap),
          },
        },
      };

      return updatedC;
    });

    searchSecondaryCells(searchCells, updatedCells, adventure.dungeon.cells);

    void (await this.prismaService.adventure.update({
      where: { id: adventure.id },
      data: {
        dungeon: {
          ...adventure.dungeon,
          heroes: adventure.dungeon.heroes.map((h) =>
            h.id === hero.id ? { ...h, actionPoints: h.actionPoints - 1 } : h,
          ),
          cells: updatedCells,
        } as unknown as InputJsonValue,
      },
    }));

    this.adventuresGateway.handleDownSearch(campaign.id, hero.id);
  }
}
