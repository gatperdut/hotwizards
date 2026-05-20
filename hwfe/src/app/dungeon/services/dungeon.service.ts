import { inject, Injectable, signal } from '@angular/core';
import { HwAdventure } from '@hw/shared/adventures';
import { HwDungeon } from '@hw/shared/dungeon';
import { BaseSpritePath, SpritePath } from '@hw/shared/sprites';
import { Sprite } from 'pixi.js';
import { groundZIndex, world2Ground } from '../../map/consts/coords.const.';
import { DungeonWidth } from '../../map/consts/dungeon-size.const';
import { TextureService } from '../../map/services/texture.service';
import { ViewportService } from '../../map/services/viewport.service';
import { BaseSpriteHitArea } from '../../sprites/ground-hit-area.const';
import { SpriteOffsets, SpriteSizes } from '../../sprites/sprites.const';
import { HwfeCell } from '../interfaces/cell.interface';
import { HwfeDungeon } from '../interfaces/dungeon.interface';

@Injectable()
export class DungeonService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);

  public adventure = signal<HwAdventure>(null!);

  public hwfeDungeon = signal<HwfeDungeon>(null!);

  public setup(adventure: HwAdventure): void {
    this.adventure.set(adventure);
    this.hwfeDungeon.set(this.hwDungeon2HwfeDungeon(adventure.dungeon));
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
    baseSprite.eventMode = 'static';
    baseSprite.cursor = 'pointer';
    baseSprite.hitArea = BaseSpriteHitArea;
    return baseSprite;
  }
}
