import { computed, inject, Injectable, signal } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { HwDungeon, HwHero } from '@hw/shared/dungeon';
import { BaseSpritePath, SpritePath } from '@hw/shared/sprites';
import { Sprite } from 'pixi.js';
import { CampaignService } from '../../campaigns/campaign/campaign.service';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { CreatureSpriteZIndex } from '../../sprites/creature-sprites.const';
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
    this.hwfeDungeon.set(this.hwDungeon2HwfeDungeon(adventure.dungeon));
  }

  private hwfeHeroesSetup(): void {
    const hwfeHeroes: HwfeHero[] = this.adventure().dungeon.heroes.map((hero) => {
      return { ...hero, pixi: { sprite: this.createHeroSprite(hero) } };
    });

    this.hwfeHeroes.set(hwfeHeroes);
  }

  private hwDungeon2HwfeDungeon(dungeon: HwDungeon): HwfeDungeon {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell) => this.createHwfeCell(cell.x, cell.y, cell.baseSpritePath)),
    };
  }

  public createHwfeCell(x: number, y: number, baseSpritePath: BaseSpritePath): HwfeCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);

    const cell: HwfeCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      pixi: {
        baseSprite: baseSprite,
      },
      creatureId: null,
    };

    return cell;
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
}
