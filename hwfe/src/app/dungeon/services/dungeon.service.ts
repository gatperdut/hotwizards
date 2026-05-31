import { computed, inject, Injectable, signal } from '@angular/core';
import { Direction, DirectionOffsets } from '@hw/shared/directions';
import { cellIsTraversable, HwCell, HwCreature, HwHero, HwMonster } from '@hw/shared/dungeon';
import {
  AdventuresDownstream,
  AdventuresUpstream,
  CampaignsDownstream,
  CampaignsUpstream,
} from '@hw/shared/sockets';
import {
  BaseSpritePath,
  CornerSpritePath,
  DoorSpritePath,
  FeatureSpritePath,
  FloorTrapSpritePath,
  SpritePath,
  StairsSpritePath,
} from '@hw/shared/sprites';
import { FederatedPointerEvent, Sprite } from 'pixi.js';
import { Socket } from 'socket.io-client';
import { AuthService } from '../../auth/services/auth.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { CreatureUnselectTint } from '../../sprites/creature-sprites.const';
import { BaseSpriteHitArea } from '../../sprites/ground-hit-area.const';
import { HeroSpriteTints } from '../../sprites/hero-sprites.const';
import { MonsterSelectedTint, MonsterViewedTint } from '../../sprites/monster-sprites.const';
import { SpriteOffsets, SpriteSizes, spriteZIndex } from '../../sprites/sprites.const';
import { HwfeCell } from '../interfaces/cell.interface';
import { HwfeCorners } from '../interfaces/corners.interface';
import { HwfeHero } from '../interfaces/hero.interface';
import { HwfeMonster } from '../interfaces/monster.interface';

@Injectable()
export class DungeonService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);

  public campaignsSocket!: Socket<CampaignsDownstream, CampaignsUpstream>;
  public adventuresSocket!: Socket<AdventuresDownstream, AdventuresUpstream>;

  private hwfeCells = signal<HwfeCell[]>([]);
  public hwfeHeroes = signal<HwfeHero[]>([]);
  public hwfeMonsters = signal<HwfeMonster[]>([]);

  public selectedMonster = signal<HwfeMonster | null>(null);
  public viewedMonster = signal<HwfeMonster | null>(null);

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
      .adventure!.dungeon.heroes.map((hero) => ({
        ...hero,
        pixi: { sprite: this.createHeroSprite(hero) },
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
        const updatedCell = this.campaignService
          .campaign()
          .adventure!.dungeon.cells.find((c) => c.x === cell.x && c.y === cell.y)!;

        return {
          ...cell,
          creatureId: updatedCell.creatureId,
        };
      }),
    );
  }

  public hwfeHeroesUpdate(): void {
    this.hwfeHeroes.update((heroes) =>
      heroes.map((hero) => {
        const updatedHero = this.campaignService
          .campaign()
          .adventure!.dungeon.heroes.find((h) => h.id === hero.id)!;

        let sprite: Sprite;

        if (hero.spritePath !== updatedHero.spritePath) {
          this.viewportService.destroySprite(hero.pixi.sprite);
          sprite = this.createHeroSprite(updatedHero);
        } else {
          sprite = hero.pixi.sprite;
        }

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

  public createHwfeCell(cell: HwCell): HwfeCell {
    const baseSprite = this.createBaseSprite(cell.x, cell.y, cell.baseSpritePath);
    const featureSprite = cell.feature.spritePath
      ? this.createFeatureSprite(cell.x, cell.y, cell.feature.spritePath)
      : null;
    const doorSprite = cell.door?.spritePath
      ? this.createDoorSprite(cell.x, cell.y, cell.door.spritePath)
      : null;
    const floorTrapSprite = cell.floorTrap.spritePath
      ? this.createFloorTrapSprite(cell.x, cell.y, cell.floorTrap.spritePath)
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
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        doorSprite: doorSprite,
        floorTrapSprite: floorTrapSprite,
        stairsSprite: stairsSprite,
        corners: pixiCorners,
      },
      visibility: cell.visibility,
    };

    baseSprite.eventMode = 'static';
    baseSprite.cursor = 'pointer';
    baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, hwfeCell));

    return hwfeCell;
  }

  private tintHeroSprites(): void {
    const hwfeHeroes = this.hwfeHeroes();
    if (!hwfeHeroes.length) {
      return;
    }
    hwfeHeroes.forEach((hero) => {
      hero.pixi.sprite.tint = HeroSpriteTints[this.hwfeHeroes().findIndex((h) => h.id === hero.id)];
    });
  }

  private moveSprite(sprite: Sprite, spritePath: SpritePath, x: number, y: number): void {
    sprite.position.copyFrom(world2Ground(x, y));
    sprite.position.x += SpriteOffsets[spritePath].x;
    sprite.position.y += SpriteOffsets[spritePath].y;
    sprite.zIndex = groundZIndex(x, y, DungeonWidth);
    sprite.zIndex += spriteZIndex(spritePath);

    this.tintHeroSprites();
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

  private createHeroSprite(hero: HwHero): Sprite {
    const heroSprite = this.createSprite(hero.x, hero.y, hero.spritePath);
    heroSprite.eventMode = 'none';
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

  private findCell(x: number, y: number): HwCell | undefined {
    return this.campaignService
      .campaign()
      .adventure!.dungeon.cells.find((cell) => cell.x === x && cell.y === y);
  }

  public canWalk(creature: HwCreature, direction: Direction): boolean {
    if (creature.movementPoints < 1) {
      return false;
    }

    const cell = this.findCell(
      creature.x + DirectionOffsets[direction].x,
      creature.y + DirectionOffsets[direction].y,
    );
    return !!cell && cellIsTraversable(cell);
  }

  private baseSpriteTap(event: FederatedPointerEvent, hwfeCell: HwfeCell): void {
    if (this.viewportService.dragging) {
      return;
    }

    event.stopPropagation();

    const activePlayer = this.activePlayer();

    const monsterId =
      this.hwfeMonsters().find((m) => m.x === hwfeCell.x && m.y === hwfeCell.y)?.id ?? null;

    if (
      (!this.campaignService.master().me || !activePlayer?.me) &&
      this.selectedMonster()?.id !== monsterId
    ) {
      this.viewMonster(monsterId);
    } else {
      this.adventuresSocket.emit('upSelectMonster', {
        monsterId: monsterId ?? null,
      });
    }
  }

  public selectMonster(monsterId: number | null, manual: boolean): void {
    const viewedMonster = this.viewedMonster();
    if (viewedMonster?.id === monsterId) {
      this.viewMonster(null);
    }

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

  public viewMonster(monsterId: number | null): void {
    const prevViewedMonster = this.viewedMonster();
    if (prevViewedMonster) {
      prevViewedMonster.pixi.sprite.tint = CreatureUnselectTint;

      if (prevViewedMonster.id === monsterId) {
        this.viewedMonster.set(null);
        return;
      }
    }

    const viewedMonster = this.hwfeMonsters().find((m) => m.id === monsterId) ?? null;
    this.viewedMonster.set(viewedMonster);
    if (viewedMonster) {
      viewedMonster.pixi.sprite.tint = MonsterViewedTint;
    }
  }
}
