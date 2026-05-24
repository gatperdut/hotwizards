import { computed, inject, Injectable, signal } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { Direction, DirectionOffsets } from '@hw/shared/directions';
import {
  cellIsTraversable,
  HwCell,
  HwCreature,
  HwDungeon,
  HwHero,
  HwMonster,
} from '@hw/shared/dungeon';
import {
  BaseSpritePath,
  CornerSpritePath,
  DoorSpritePath,
  FeatureSpritePath,
  FloorTrapSpritePath,
  SpritePath,
  StairsSpritePath,
} from '@hw/shared/sprites';
import { Sprite } from 'pixi.js';
import { AuthService } from '../../auth/services/auth.service';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { CreatureSpriteZIndex } from '../../sprites/creature-sprites.const';
import { FeatureSpriteZIndex } from '../../sprites/feature-sprites.const';
import { SpriteOffsets, SpriteSizes } from '../../sprites/sprites.const';
import { HwfeCell } from '../interfaces/cell.interface';
import { HwfeCorners } from '../interfaces/corners.interface';
import { HwfeDungeon } from '../interfaces/dungeon.interface';
import { HwfeHero } from '../interfaces/hero.interface';
import { HwfeMonster } from '../interfaces/monster.interface';

@Injectable()
export class DungeonService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private campaignService = inject(CampaignService);
  private authService = inject(AuthService);

  public adventure = signal<HwAdventure>(null!);
  public hwfeDungeon = signal<HwfeDungeon>(null!);
  public hwfeHeroes = signal<HwfeHero[]>([]);
  public hwfeMonsters = signal<HwfeMonster[]>([]);
  public hwfeCreatures = computed(() => [...this.hwfeHeroes(), ...this.hwfeMonsters()]);

  public activePlayer = computed(() => {
    const adventure = this.adventure();
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
    return this.hwfeHeroes().find((hero) => hero.id === this.authService.userId());
  });

  public setup(adventure: HwAdventure): void {
    this.adventure.set(adventure);
    this.hwfeHeroesSetup();
    this.hwfeMonstersSetup();
    this.hwfeDungeon.set(this.hwDungeon2HwfeDungeon(adventure.dungeon));
  }

  private hwfeHeroesSetup(): void {
    const hwfeHeroes: HwfeHero[] = this.adventure().dungeon.heroes.map((hero) => ({
      ...hero,
      pixi: { sprite: this.createHeroSprite(hero) },
    }));
    this.hwfeHeroes.set(hwfeHeroes);
  }

  private hwfeMonstersSetup(): void {
    const hwfeMonsters: HwfeMonster[] = this.adventure().dungeon.monsters.map((monster) => ({
      ...monster,
      pixi: { sprite: this.createMonsterSprite(monster) },
    }));
    this.hwfeMonsters.set(hwfeMonsters);
  }

  private hwDungeon2HwfeDungeon(dungeon: HwDungeon): HwfeDungeon {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell) => this.createHwfeCell(cell)),
    };
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
    };

    return hwfeCell;
  }

  private createSprite(x: number, y: number, spritePath: SpritePath): Sprite {
    const sprite = new Sprite(this.textureService.textures[spritePath]);
    sprite.zIndex = groundZIndex(x, y, DungeonWidth);
    sprite.position.copyFrom(world2Ground(x, y));
    sprite.setSize(SpriteSizes[spritePath].x, SpriteSizes[spritePath].y);
    sprite.position.x += SpriteOffsets[spritePath].x;
    sprite.position.y += SpriteOffsets[spritePath].y;
    sprite.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite);
    return sprite;
  }

  private createBaseSprite(x: number, y: number, baseSpritePath: BaseSpritePath): Sprite {
    const baseSprite = this.createSprite(x, y, baseSpritePath);
    baseSprite.eventMode = 'none';
    return baseSprite;
  }

  private createHeroSprite(hero: HwHero): Sprite {
    const heroSprite = this.createSprite(hero.x, hero.y, hero.spritePath);
    heroSprite.zIndex += CreatureSpriteZIndex;
    heroSprite.eventMode = 'none';
    return heroSprite;
  }

  private createMonsterSprite(monster: HwMonster): Sprite {
    const monsterSprite = this.createSprite(monster.x, monster.y, monster.spritePath);
    monsterSprite.zIndex += CreatureSpriteZIndex;
    monsterSprite.eventMode = 'none';
    return monsterSprite;
  }

  private createFeatureSprite(x: number, y: number, featureSpritePath: FeatureSpritePath): Sprite {
    const featureSprite = this.createSprite(x, y, featureSpritePath!);
    featureSprite.zIndex += FeatureSpriteZIndex;
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

  private findCell(x: number, y: number): HwfeCell | undefined {
    return this.hwfeDungeon().cells.find((cell) => cell.x === x && cell.y === y);
  }

  public canWalk(creature: HwCreature, direction: Direction): boolean {
    const cell = this.findCell(
      creature.x + DirectionOffsets[direction].x,
      creature.y + DirectionOffsets[direction].y,
    );

    return !!cell && cellIsTraversable(cell);
  }
}
