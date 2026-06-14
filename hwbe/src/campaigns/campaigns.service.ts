import { Movement, Prisma } from '@hw/prismagen/client';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwCampaign } from '@hw/shared/campaigns';
import { HwCharacter } from '@hw/shared/characters';
import { Directions } from '@hw/shared/directions';
import {
  cellAt,
  cellsUpdateLos,
  creatureAt,
  creatureAttackDie,
  creatureBodyPoints,
  creatureDefendDie,
  creatureMindPoints,
  creatureMovementPoints,
  HwCell,
  HwDoor,
  HwDungeon,
  HwFeature,
  HwFloorTrap,
  HwHero,
  HwMonster,
  MonsterNames,
  monsterStartingInventory,
} from '@hw/shared/dungeon';
import { HwEditorCell, HwEditorDungeon, HwEditorFeature } from '@hw/shared/editor';
import { HwMembership } from '@hw/shared/memberships';
import { Paginated } from '@hw/shared/pagination';
import {
  DoorSpritePath,
  FloorTrapSpritePath,
  heroSpritePath,
  monsterSpritePath,
} from '@hw/shared/sprites';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InputJsonObject, InputJsonValue } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from '../push/push.service.js';
import { CampaignHwRelations, campaignToHwCampaign } from './campaign-to-hw-campaign.js';
import { CampaignsAllGateway } from './campaigns-all.gateway.js';
import { CampaignsSingleGateway } from './campaigns-single.gateway.js';

@Injectable()
export class CampaignsService {
  constructor(
    private prismaService: PrismaService,
    private campaignsAllGateway: CampaignsAllGateway,
    private campaignsSingleGateway: CampaignsSingleGateway,
    private pushService: PushService,
    private configService: ConfigService,
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
        stash: {
          gold: 0,
          items: [],
        },
      },
    });

    this.campaignsAllGateway.handleDownCreateCampaign(campaign.id, masterId);

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

    this.campaignsAllGateway.handleDownUpdateCampaign(campaign);
    this.campaignsSingleGateway.handleDownUpdateCampaign(campaign.id);

    campaign.memberships.forEach((m) => {
      void this.pushService.notifyUser(m.userId, {
        title: 'Campaign renamed',
        body: `Campaign ${campaign.name} has been renamed to ${name}`,
        icon: '/portraits/zargon.png',
        url: `/home/campaigns/${campaign.id}`,
      });
    });

    return campaign.id;
  }

  public async delete(campaign: HwCampaign): Promise<number> {
    await this.prismaService.campaign.delete({
      where: { id: campaign.id },
    });

    this.campaignsAllGateway.handleDownDeleteCampaign(campaign);
    this.campaignsSingleGateway.handleDownDeleteCampaign(campaign.id);

    campaign.memberships.forEach((m) => {
      void this.pushService.notifyUser(m.userId, {
        title: campaign.name,
        body: 'The campaign has been deleted',
        icon: '/portraits/zargon.png',
        url: `${this.configService.get('HWBE_CORS_ORIGIN')}/home/campaigns`,
      });
    });

    return campaign.id;
  }

  public async dropGold(campaign: HwCampaign, amount: number): Promise<void> {
    const stash = { ...campaign.stash };
    stash.gold += amount;

    await this.prismaService.campaign.update({
      where: { id: campaign.id },
      data: {
        stash: stash as unknown as InputJsonObject,
      },
    });

    this.campaignsSingleGateway.handleDownDropGold(campaign.id, amount);
  }

  public async startAdventure(
    campaign: HwCampaign,
    adventureTemplate: HwAdventureTemplate,
  ): Promise<number> {
    const pendingMemberships = campaign.memberships.filter((m) => m.status === 'PENDING');

    if (pendingMemberships.length) {
      throw new UnprocessableEntityException('There are pending memberships');
    }

    const adventure = await this.prismaService.adventure.create({
      data: {
        campaignId: campaign.id,
        templateId: adventureTemplate.id,
        turn: 1,
        dungeon: this.editorDungeonToDungeon(
          campaign,
          adventureTemplate.dungeon,
        ) as unknown as InputJsonValue,
      },
      include: {
        template: true,
      },
    });

    this.campaignsSingleGateway.handleDownStartAdventure(campaign.id);

    return adventure.id;
  }

  private editorDungeonToDungeon(campaign: HwCampaign, editorDungeon: HwEditorDungeon): HwDungeon {
    const cells = editorDungeon.cells.map((editorCell) => this.editorCellToCell(editorCell));

    const heroes = this.charactersToHeroes(
      campaign.memberships,
      editorDungeon.cells
        .filter((editorCell) => editorCell.spawn)
        .map((editorCell) => cellAt(cells, editorCell.x, editorCell.y))
        .filter((cell) => !!cell),
      campaign.ruleset.movement,
    );

    cellsUpdateLos(
      cells,
      heroes.map((h) => cellAt(cells, h.x, h.y)!),
    );

    const monsters = this.cellsToMonsters(
      editorDungeon.cells,
      heroes.map((h) => h.id),
      campaign.ruleset.movement,
    );

    cells.forEach((cell) => {
      cell.creatureId =
        creatureAt(monsters, cell.x, cell.y)?.id || creatureAt(heroes, cell.x, cell.y)?.id || null;
    });

    const response: HwDungeon = {
      cells: cells,
      heroes: heroes,
      monsters: monsters,
    };

    return response;
  }

  private editorCellToCell(editorCell: HwEditorCell): HwCell {
    const response: HwCell = {
      x: editorCell.x,
      y: editorCell.y,
      creatureId: null,
      baseSpritePath: editorCell.baseSpritePath,
      feature: this.editorFeatureToFeature(editorCell.feature),
      door: editorCell.doorSpritePath ? this.editorDoorToDoor(editorCell.doorSpritePath) : null,
      floorTrap: this.floorTrap(editorCell.floorTrapSpritePath),
      stairsSpritePath: editorCell.stairsSpritePath,
      corners: { ...editorCell.corners },
      secondary: editorCell.secondary ? { ...editorCell.secondary } : null,
      visibility: 0,
      loot: {
        gold: 0,
        items: [],
      },
    };

    return response;
  }

  private charactersToHeroes(
    memberships: HwMembership[],
    spawnCells: HwCell[],
    movement: Movement,
  ): HwHero[] {
    return memberships.map((membership, index) => {
      const character = membership.character as HwCharacter;
      const user = membership.user;

      const direction = Directions[Math.floor(Math.random() * Directions.length)];
      const spawnCell = spawnCells[index];

      spawnCell.creatureId = user.id;

      const movementPoints = creatureMovementPoints(character.klass, character.inventory, movement);
      console.log('hero created', movementPoints);
      return {
        id: user.id,
        membershipId: membership.id,
        name: character.name,
        gender: character.gender,
        klass: character.klass,
        me: false,
        alignment: 'HERO',
        attackDie: creatureAttackDie(character.klass, character.inventory),
        defendDie: creatureDefendDie(character.klass, character.inventory),
        movementPoints: movementPoints,
        maxMovementPoints: movementPoints,
        bodyPoints: creatureBodyPoints(character.klass, character.inventory),
        mindPoints: creatureMindPoints(character.klass, character.inventory),
        spritePath: heroSpritePath(character.klass, character.gender, direction),
        direction: direction,
        x: spawnCell.x,
        y: spawnCell.y,
        inventory: { ...character.inventory },
      };
    });
  }

  private cellsToMonsters(
    cells: HwEditorCell[],
    heroIds: number[],
    movement: Movement,
  ): HwMonster[] {
    const idsTaken: number[] = [...heroIds];

    return cells
      .map((cell) => {
        if (!cell.monster.type) {
          return null;
        }

        const inventory = monsterStartingInventory(cell.monster.type);
        const movementPoints = creatureMovementPoints(cell.monster.type, inventory, movement);

        const monster: HwMonster = {
          id: this.generateMonsterId(idsTaken),
          type: cell.monster.type,
          name: MonsterNames[cell.monster.type][
            Math.floor(Math.random() * MonsterNames[cell.monster.type].length)
          ],
          alignment: 'MONSTER',
          attackDie: creatureAttackDie(cell.monster.type, inventory),
          defendDie: creatureDefendDie(cell.monster.type, inventory),
          movementPoints: movementPoints,
          maxMovementPoints: movementPoints,
          bodyPoints: creatureBodyPoints(cell.monster.type, inventory),
          mindPoints: creatureMindPoints(cell.monster.type, inventory),
          spritePath: monsterSpritePath(cell.monster.type, cell.monster.direction),
          direction: cell.monster.direction,
          x: cell.x,
          y: cell.y,
          inventory: inventory,
        };
        return monster;
      })
      .filter((cell) => !!cell);
  }

  private editorFeatureToFeature(editorFeature: HwEditorFeature): HwFeature {
    return {
      spritePath: editorFeature.spritePath,
      trapped: editorFeature.trapped,
      found: false,
      sprung: false,
    };
  }

  private editorDoorToDoor(doorSpritePath: DoorSpritePath | null): HwDoor {
    return {
      spritePath: doorSpritePath,
      trapped: false,
      found: false,
      sprung: false,
      open: false,
    };
  }

  private floorTrap(floorTrapSpritePath: FloorTrapSpritePath | null): HwFloorTrap {
    return {
      spritePath: floorTrapSpritePath,
      found: false,
      sprung: false,
    };
  }

  private generateMonsterId(idsTaken: number[]): number {
    let id = 1;
    while (idsTaken.includes(id)) {
      id++;
    }

    idsTaken.push(id);

    return id;
  }
}
