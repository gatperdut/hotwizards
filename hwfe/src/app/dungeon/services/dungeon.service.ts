import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { Adjacent, AdjacentOffsets } from '@hw/shared/directions';
import { cellAt, creatureAt, HwCell, HwCreature, HwHero, HwMonster } from '@hw/shared/dungeon';
import {
  AdventuresDownstream,
  AdventuresUpstream,
  CampaignsSingleDownstream,
  CampaignsSingleUpstream,
} from '@hw/shared/sockets';
import {
  BaseSpritePath,
  CornerSpritePath,
  DoorSpritePath,
  DoorTrapSpritePath,
  FeatureSpritePath,
  FeatureTrapSpritePath,
  FloorTrapSpritePath,
  LootSpritePath,
  SpritePath,
  StairsSpritePath,
} from '@hw/shared/sprites';
import { FederatedPointerEvent, Sprite } from 'pixi.js';
import { Socket } from 'socket.io-client';
import { AdventuresApiService } from '../../adventures/services/adventures-api.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { CreatureUnselectTint } from '../../sprites/creature-sprites.const';
import { BaseSpriteHitArea } from '../../sprites/ground-hit-area.const';
import { HeroSpriteTints } from '../../sprites/hero-sprites.const';
import { MonsterSelectedTint } from '../../sprites/monster-sprites.const';
import { GreenSpriteTintSubtraction } from '../../sprites/sprite-tints.const';
import { SpriteOffsets, SpriteSizes, spriteZIndex } from '../../sprites/sprites.const';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  CreatureDialogComponent,
  CreatureDialogData,
  CreatureDialogResult,
} from '../creature-dialog/creature-dialog.component';
import { HwfeCell } from '../interfaces/cell.interface';
import { HwfeCorners } from '../interfaces/corners.interface';
import { HwfeHero } from '../interfaces/hero.interface';
import { HwfeMonster } from '../interfaces/monster.interface';

@Injectable()
export class DungeonService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private campaignService = inject(CampaignService);
  private adventuresApiService = inject(AdventuresApiService);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);

  public campaignsSingleSocket!: Socket<CampaignsSingleDownstream, CampaignsSingleUpstream>;
  public adventuresSocket!: Socket<AdventuresDownstream, AdventuresUpstream>;

  public hwfeCells = signal<HwfeCell[]>([]);
  public hwfeHeroes = signal<HwfeHero[]>([]);
  public hwfeMonsters = signal<HwfeMonster[]>([]);

  public selectedMonster = signal<HwfeMonster | null>(null);

  public activePlayer = computed(() => {
    const adventure = this.campaignService.campaign().adventure;
    return adventure
      ? [
          this.campaignService.campaign().master,
          ...this.campaignService.memberships().map((m) => m.user),
        ][adventure.turn]
      : undefined;
  });

  public activeHero = computed(() => {
    const activePlayer = this.activePlayer();

    if (!activePlayer) {
      return undefined;
    }

    return this.hwfeHeroes().find((hero) => hero.id === activePlayer.id);
  });

  public myHero = computed(() => {
    return this.hwfeHeroes().find((hero) => hero.me);
  });

  public setup(): void {
    this.hwfeCellsSet();
    this.hwfeHeroesSet();
    this.hwfeMonstersSet();
  }

  private hwfeCellsSet(): void {
    const hwfeCells = this.campaignService
      .campaign()
      .adventure!.dungeon.cells.map((cell) => this.createHwfeCell(cell));
    this.hwfeCells.set(hwfeCells);
  }

  private hwfeHeroesSet(): void {
    const hwfeHeroes: HwfeHero[] = this.campaignService
      .campaign()
      .adventure!.dungeon.heroes.map((hero, index) => ({
        ...hero,
        pixi: { sprite: this.createHeroSprite(hero, index) },
      }));
    this.hwfeHeroes.set(hwfeHeroes);
  }

  private hwfeMonstersSet(): void {
    const hwfeMonsters: HwfeMonster[] = this.campaignService
      .campaign()
      .adventure!.dungeon.monsters.map((monster) => ({
        ...monster,
        pixi: { sprite: this.createMonsterSprite(monster) },
      }));
    this.hwfeMonsters.set(hwfeMonsters);
  }

  public hwfeCellsUpdate(): void {
    this.hwfeCells.update((cells) =>
      cells.map((cell) => {
        const updatedCell = cellAt(
          this.campaignService.campaign().adventure!.dungeon.cells,
          cell.x,
          cell.y,
        )!;

        const resultCell: HwfeCell = {
          ...cell,
          creatureId: updatedCell.creatureId,
          visibility: updatedCell.visibility,
          searched: updatedCell.searched,
        };

        resultCell.door.open = updatedCell.door.open;
        resultCell.door.trap.found = updatedCell.door.trap.found;
        resultCell.feature.trap.found = updatedCell.feature.trap.found;
        resultCell.searched = updatedCell.searched;

        if (cell.door.spritePath !== updatedCell.door.spritePath) {
          if (cell.door.spritePath) {
            this.viewportService.destroySprite(cell.pixi.doorSprite!);
          }
          if (updatedCell.door.spritePath) {
            cell.pixi.doorSprite = this.createDoorSprite(
              updatedCell.x,
              updatedCell.y,
              updatedCell.door.spritePath,
            );
          }
        }

        if (
          (updatedCell.loot.gold > 0 || updatedCell.loot.items.length > 0) &&
          !cell.pixi.lootSprite
        ) {
          cell.pixi.lootSprite = this.createLootSprite(
            updatedCell.x,
            updatedCell.y,
            '/tiles/loots/loot.png',
          );
        }

        if (
          updatedCell.loot.gold <= 0 &&
          updatedCell.loot.items.length <= 0 &&
          cell.pixi.lootSprite
        ) {
          this.viewportService.destroySprite(cell.pixi.lootSprite);
        }

        if (!cell.searched && updatedCell.searched) {
          cell.pixi.baseSprite.tint -= GreenSpriteTintSubtraction;
        }

        return resultCell;
      }),
    );
  }

  public hwfeHeroesUpdate(): void {
    this.hwfeHeroes.update((heroes) =>
      heroes.map((hero, index) => {
        const updatedHero = this.campaignService
          .campaign()
          .adventure!.dungeon.heroes.find((h) => h.id === hero.id)!;

        let sprite: Sprite;

        if (hero.direction !== updatedHero.direction) {
          this.viewportService.destroySprite(hero.pixi.sprite);
          sprite = this.createHeroSprite(updatedHero, index);
        } else {
          sprite = hero.pixi.sprite;
        }

        sprite.tint = HeroSpriteTints[index];

        this.moveSprite(sprite, updatedHero.spritePath, updatedHero.x, updatedHero.y);

        return {
          ...updatedHero,
          me: hero.me,
          pixi: {
            sprite: sprite,
          },
        };
      }),
    );
  }

  public hwfeMonstersUpdate(): void {
    this.hwfeMonsters.update((monsters) =>
      monsters.map((monster) => {
        const updatedMonster = this.campaignService
          .campaign()
          .adventure!.dungeon.monsters.find((m) => m.id === monster.id)!;

        let sprite: Sprite;

        if (monster.spritePath !== updatedMonster.spritePath) {
          this.viewportService.destroySprite(monster.pixi.sprite);
          sprite = this.createMonsterSprite(updatedMonster);
        } else {
          sprite = monster.pixi.sprite;
        }

        this.moveSprite(sprite, updatedMonster.spritePath, updatedMonster.x, updatedMonster.y);

        return {
          ...updatedMonster,
          pixi: {
            sprite: sprite,
          },
        };
      }),
    );

    const selectedMonster = this.selectedMonster();
    if (selectedMonster) {
      this.selectMonster(selectedMonster.id, false);
    }
  }

  private createHwfeCell(cell: HwCell): HwfeCell {
    const baseSprite = this.createBaseSprite(cell.x, cell.y, cell.baseSpritePath);
    const featureSprite = cell.feature.spritePath
      ? this.createFeatureSprite(cell.x, cell.y, cell.feature.spritePath)
      : null;
    const doorSprite = cell.door.spritePath
      ? this.createDoorSprite(cell.x, cell.y, cell.door.spritePath)
      : null;
    const floorTrapSprite = cell.floorTrap.spritePath
      ? this.createFloorTrapSprite(cell.x, cell.y, cell.floorTrap.spritePath)
      : null;
    const featureTrapSprite = cell.feature.trap.spritePath
      ? this.createFeatureTrapSprite(cell.x, cell.y, cell.feature.trap.spritePath)
      : null;
    const doorTrapSprite = cell.door.trap.spritePath
      ? this.createDoorTrapSprite(cell.x, cell.y, cell.door.trap.spritePath)
      : null;
    const stairsSprite = cell.stairsSpritePath
      ? this.createStairsSprite(cell.x, cell.y, cell.stairsSpritePath)
      : null;
    const pixiCorners: HwfeCorners = {
      n: cell.corners.n
        ? this.createCornerSprite(cell.x, cell.y, '/tiles/corners/corner_n.png')
        : null,
      e: cell.corners.e
        ? this.createCornerSprite(cell.x, cell.y, '/tiles/corners/corner_e.png')
        : null,
      s: cell.corners.s
        ? this.createCornerSprite(cell.x, cell.y, '/tiles/corners/corner_s.png')
        : null,
      w: cell.corners.w
        ? this.createCornerSprite(cell.x, cell.y, '/tiles/corners/corner_w.png')
        : null,
    };
    const lootSprite =
      cell.loot.gold > 0 || !!cell.loot.items.length
        ? this.createLootSprite(cell.x, cell.y, '/tiles/loots/loot.png')
        : null;

    const hwfeCell: HwfeCell = {
      x: cell.x,
      y: cell.y,
      baseSpritePath: cell.baseSpritePath,
      creatureId: null,
      feature: cell.feature,
      door: cell.door,
      floorTrap: cell.floorTrap,
      stairsSpritePath: cell.stairsSpritePath,
      corners: { ...cell.corners },
      secondary: cell.secondary ? { ...cell.secondary } : null,
      visibility: cell.visibility,
      loot: {
        gold: cell.loot.gold,
        items: [...cell.loot.items],
      },
      searched: cell.searched,
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        doorSprite: doorSprite,
        floorTrapSprite: floorTrapSprite,
        featureTrapSprite: featureTrapSprite,
        doorTrapSprite: doorTrapSprite,
        stairsSprite: stairsSprite,
        corners: pixiCorners,
        lootSprite: lootSprite,
      },
    };

    baseSprite.eventMode = 'static';
    baseSprite.cursor = 'pointer';
    baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, hwfeCell.x, hwfeCell.y));

    return hwfeCell;
  }

  private moveSprite(sprite: Sprite, spritePath: SpritePath, x: number, y: number): void {
    sprite.position.copyFrom(world2Ground(x, y));
    sprite.position.x += SpriteOffsets[spritePath].x;
    sprite.position.y += SpriteOffsets[spritePath].y;
    sprite.zIndex = groundZIndex(x, y, DungeonWidth);
    sprite.zIndex += spriteZIndex(spritePath);
  }

  private createSprite(x: number, y: number, spritePath: SpritePath): Sprite {
    const sprite = new Sprite(this.textureService.textures[spritePath]);
    sprite.setSize(SpriteSizes[spritePath].x, SpriteSizes[spritePath].y);
    this.moveSprite(sprite, spritePath, x, y);
    sprite.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite);
    return sprite;
  }

  private createBaseSprite(x: number, y: number, baseSpritePath: BaseSpritePath): Sprite {
    const baseSprite = this.createSprite(x, y, baseSpritePath);
    baseSprite.eventMode = 'none';
    baseSprite.hitArea = BaseSpriteHitArea;
    return baseSprite;
  }

  private createHeroSprite(hero: HwHero, index: number): Sprite {
    const heroSprite = this.createSprite(hero.x, hero.y, hero.spritePath);
    heroSprite.eventMode = 'none';
    heroSprite.tint = HeroSpriteTints[index];
    return heroSprite;
  }

  private createMonsterSprite(monster: HwMonster): Sprite {
    const monsterSprite = this.createSprite(monster.x, monster.y, monster.spritePath);
    monsterSprite.eventMode = 'none';
    return monsterSprite;
  }

  private createFeatureSprite(x: number, y: number, featureSpritePath: FeatureSpritePath): Sprite {
    const featureSprite = this.createSprite(x, y, featureSpritePath!);
    featureSprite.eventMode = 'none';
    return featureSprite;
  }

  private createDoorSprite(x: number, y: number, doorSpritePath: DoorSpritePath): Sprite {
    const doorSprite = this.createSprite(x, y, doorSpritePath!);
    doorSprite.eventMode = 'none';
    return doorSprite;
  }

  private createFloorTrapSprite(
    x: number,
    y: number,
    floorTrapSpritePath: FloorTrapSpritePath,
  ): Sprite {
    const floorTrapSprite = this.createSprite(x, y, floorTrapSpritePath!);
    floorTrapSprite.eventMode = 'none';
    return floorTrapSprite;
  }

  private createFeatureTrapSprite(
    x: number,
    y: number,
    featureTrapSpritePath: FeatureTrapSpritePath,
  ): Sprite {
    const featureTrapSprite = this.createSprite(x, y, featureTrapSpritePath!);
    featureTrapSprite.eventMode = 'none';
    return featureTrapSprite;
  }

  private createDoorTrapSprite(
    x: number,
    y: number,
    doorTrapSpritePath: DoorTrapSpritePath,
  ): Sprite {
    const doorTrapSprite = this.createSprite(x, y, doorTrapSpritePath!);
    doorTrapSprite.eventMode = 'none';
    return doorTrapSprite;
  }

  private createStairsSprite(x: number, y: number, stairsSpritePath: StairsSpritePath): Sprite {
    const stairsSprite = this.createSprite(x, y, stairsSpritePath!);
    stairsSprite.eventMode = 'none';
    return stairsSprite;
  }

  private createCornerSprite(x: number, y: number, cornerSpritePath: CornerSpritePath): Sprite {
    const cornersSprite = this.createSprite(x, y, cornerSpritePath!);
    cornersSprite.eventMode = 'none';
    return cornersSprite;
  }

  private createLootSprite(x: number, y: number, lootSpritePath: LootSpritePath): Sprite {
    const lootSprite = this.createSprite(x, y, lootSpritePath!);
    lootSprite.eventMode = 'none';
    return lootSprite;
  }

  public canOpenDoor(hero: HwHero, adjacent: Adjacent): boolean {
    if (hero.movementPoints < 1) {
      return false;
    }

    const cell = cellAt(
      this.hwfeCells(),
      hero.x + AdjacentOffsets[adjacent].x,
      hero.y + AdjacentOffsets[adjacent].y,
    );
    return !!cell && !!cell.door.spritePath && !cell.door.open;
  }

  private baseSpriteTap(event: FederatedPointerEvent, x: number, y: number): void {
    if (this.viewportService.dragging) {
      return;
    }
    event.stopPropagation();

    const activePlayer = this.activePlayer()!;
    const master = this.campaignService.master();
    const hwfeCell = cellAt(this.hwfeCells(), x, y)!;

    if (hwfeCell.visibility < 2 && !master.me) {
      return;
    }

    const creature =
      creatureAt([...this.hwfeHeroes(), ...this.hwfeMonsters()], hwfeCell.x, hwfeCell.y) ?? null;
    if (!master.me || !activePlayer.me) {
      if (creature) {
        this.viewCreature(creature);
      }
    } else {
      if (!creature) {
        this.adventuresApiService
          .selectMonster(this.campaignService.campaign().adventure!.id, null)
          .subscribe();
      } else {
        if (creature.alignment === 'HERO') {
          this.viewCreature(creature);
        } else {
          const selectedMonster = this.selectedMonster();
          if (selectedMonster && selectedMonster.id === creature.id) {
            this.viewCreature(creature);
          } else {
            this.adventuresApiService
              .selectMonster(this.campaignService.campaign().adventure!.id, creature.id)
              .subscribe();
          }
        }
      }
    }
  }

  public selectMonster(monsterId: number | null, manual: boolean): void {
    const prevSelectedMonster = this.selectedMonster();
    if (prevSelectedMonster) {
      prevSelectedMonster.pixi.sprite.tint = CreatureUnselectTint;

      if (manual && prevSelectedMonster.id === monsterId) {
        this.selectedMonster.set(null);
        return;
      }
    }

    const selectedMonster = this.hwfeMonsters().find((m) => m.id === monsterId) ?? null;
    this.selectedMonster.set(selectedMonster);
    if (selectedMonster) {
      selectedMonster.pixi.sprite.tint = MonsterSelectedTint;
    }
  }

  private viewCreature(creature: HwCreature): void {
    const dialog: LazyDialog<CreatureDialogComponent, CreatureDialogData, CreatureDialogResult> = {
      importFn: () =>
        import('../creature-dialog/creature-dialog.component').then(
          (m) => m.CreatureDialogComponent,
        ),
    };

    void this.dialogService.open(
      dialog,
      {
        campaign: this.campaignService.campaign,
        user:
          creature.alignment === 'HERO'
            ? this.campaignService.memberships().find((m) => m.userId === creature.id)!.user
            : null,
        creatureId: creature.id,
      },
      this.injector,
    );
  }
}
