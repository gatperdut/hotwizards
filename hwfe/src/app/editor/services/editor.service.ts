import { inject, Injectable, signal } from '@angular/core';
import { HwCell, HwDungeon } from '@hw/shared';
import { Sprite } from 'pixi.js';
import { forkJoin, map, Observable, of } from 'rxjs';
import { groundZIndex, world2Ground } from '../../shared/coords';
import { GroundHitArea } from '../consts/ground-hit-area.const';
import { MapWidth } from '../consts/map-size.const';
import { HwDungeonPixi } from '../interfaces/map.interface';
import { TextureService } from './texture.service';
import { ViewportService } from './viewport.service';

@Injectable()
export class EditorService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);

  public map = signal<HwDungeonPixi>(null!);

  public editCell(x: number, y: number): void {
    const cell = this.cellAt(x, y);

    console.log('cell', cell);
  }

  private cellAt(x: number, y: number): HwCell | undefined {
    return this.map().cells.find((c) => c.x === x && c.y === y);
  }

  public dungeon2DungeonPixi(dungeon: HwDungeon): Observable<HwDungeonPixi> {
    if (!dungeon.cells.length) {
      return of({ ...dungeon, cells: [] });
    }

    const texturesByPath = [...new Set(dungeon.cells.map((cell) => cell.sprite))];

    return forkJoin(texturesByPath.map((path) => this.textureService.load(path))).pipe(
      map(() => ({
        cells: dungeon.cells.map((cell) => {
          const sprite = new Sprite(this.textureService.textures[cell.sprite]);
          sprite.zIndex = groundZIndex(cell.x, cell.y, MapWidth);
          sprite.position.copyFrom(world2Ground(cell.x, cell.y));
          sprite.setSize(64, 64);
          sprite.anchor.set(0.5, 0.5);
          this.viewportService.viewport.addChild(sprite);
          sprite.eventMode = 'static';
          sprite.cursor = 'pointer';
          sprite.hitArea = GroundHitArea;
          sprite.on('pointertap', (event) => {
            event.stopPropagation();
            this.editCell(cell.x, cell.y);
          });

          return {
            ...cell,
            pixi: {
              sprite: sprite,
            },
          };
        }),
      })),
    );
  }
}
