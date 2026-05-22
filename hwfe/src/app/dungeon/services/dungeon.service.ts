import { computed, inject, Injectable, signal } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { HwCell, HwDungeon, HwHero, HwMonster } from '@hw/shared/dungeon';
import { BaseSpritePath, DoorSpritePath, FeatureSpritePath, SpritePath } from '@hw/shared/sprites';
import { Sprite } from 'pixi.js';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { CreatureSpriteZIndex } from '../../sprites/creature-sprites.const';
import { FeatureSpriteZIndex } from '../../sprites/feature-sprites.const';
import { SpriteOffsets, SpriteSizes } from '../../sprites/sprites.const';
import { HwfeCell } from '../interfaces/cell.interface';
import { HwfeDungeon } from '../interfaces/dungeon.interface';
import { HwfeHero } from '../interfaces/hero.interface';
import { HwfeMonster } from '../interfaces/monster.interface';

@Injectable()
export class DungeonService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private campaignService = inject(CampaignService);

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
    const doorSprite = cell.doorSpritePath
      ? this.createDoorSprite(cell.x, cell.y, cell.doorSpritePath)
      : null;

    const hwfeCell: HwfeCell = {
      x: cell.x,
      y: cell.y,
      baseSpritePath: cell.baseSpritePath,
      creatureId: null,
      feature: cell.feature,
      doorSpritePath: cell.doorSpritePath,
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        doorSprite: doorSprite,
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
}
