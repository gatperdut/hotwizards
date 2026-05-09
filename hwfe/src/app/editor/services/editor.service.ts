import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { HwDungeon } from '@hw/shared';
import { Sprite } from 'pixi.js';
import { filter, from, Observable, switchMap, tap } from 'rxjs';
import { groundZIndex, world2Ground } from '../../shared/coords';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  CellEditorDialogComponent,
  CellEditorDialogData,
  CellEditorDialogResult,
  CellTransformData,
} from '../cell-editor-dialog/cell-editor-dialog.component';
import { DungeonWidth } from '../consts/dungeon-size.const';
import { BaseSpriteHitArea } from '../consts/ground-hit-area.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { HwPixiDungeon } from '../interfaces/pixi-dungeon.interface';
import { BaseSpritePath } from '../types/base-sprite-paths.const';
import { GroundSpritePaths } from '../types/ground-sprite-paths.const';
import { TextureService } from './texture.service';
import { ViewportService } from './viewport.service';

@Injectable()
export class EditorService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);

  public pixiDungeon = signal<HwPixiDungeon>(null!);

  public dungeon = computed(() => this.pixiDungeon2Dungeon(this.pixiDungeon()));

  public dungeon2PixiDungeon(dungeon: HwDungeon): HwPixiDungeon {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell): HwPixiCell => {
        return this.createPixiCell(cell.x, cell.y, cell.baseSpritePath as BaseSpritePath);
      }),
    };
  }

  public pixiDungeon2Dungeon(dungeon: HwPixiDungeon): HwDungeon {
    if (!dungeon) {
      return null!;
    }

    return {
      ...dungeon,
      cells: dungeon.cells.map((cell) => ({
        x: cell.x,
        y: cell.y,
        baseSpritePath: cell.baseSpritePath,
      })),
    };
  }

  public createPixiCell(
    x: number,
    y: number,
    baseSpritePath: BaseSpritePath = GroundSpritePaths[
      Math.floor(Math.random() * GroundSpritePaths.length)
    ],
  ): HwPixiCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);

    const cell: HwPixiCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      pixi: {
        baseSprite: baseSprite,
      },
    };

    cell.pixi.baseSprite.on('pointertap', (event) => {
      event.stopPropagation();
      this.editCell(cell).subscribe();
    });
    this.viewportService.viewport.addChild(cell.pixi.baseSprite);

    return cell;
  }

  public createBaseSprite(x: number, y: number, baseSpritePath: BaseSpritePath): Sprite {
    const baseSprite = new Sprite(this.textureService.textures[baseSpritePath]);
    baseSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    baseSprite.position.copyFrom(world2Ground(x, y));
    baseSprite.setSize(64, 64);
    baseSprite.anchor.set(0.5, 0.5);
    baseSprite.eventMode = 'static';
    baseSprite.cursor = 'pointer';
    baseSprite.hitArea = BaseSpriteHitArea;

    return baseSprite;
  }

  public destroybaseSprite(baseSprite: Sprite): void {
    this.viewportService.viewport.removeChild(baseSprite);
    baseSprite.destroy();
  }

  public editCell(cell: HwPixiCell): Observable<CellEditorDialogResult> {
    const dialog: LazyDialog<
      CellEditorDialogComponent,
      CellEditorDialogData,
      CellEditorDialogResult
    > = {
      importFn: () =>
        import('../cell-editor-dialog/cell-editor-dialog.component').then(
          (m) => m.CellEditorDialogComponent,
        ),
    };

    return from(this.dialogService.open(dialog, { cell: cell }, this.injector)).pipe(
      switchMap((dialogRef) => dialogRef.afterClosed$),
      filter((cellData) => cellData !== undefined),
      tap((cellData) => {
        if (cellData === null) {
          this.destroyCell(cell);
          return;
        }

        this.transformCell(cell, cellData);
      }),
    );
  }

  public addCell(cell: HwPixiCell): void {
    this.pixiDungeon.update((dungeon) => ({ ...dungeon, cells: [...dungeon.cells, cell] }));
  }

  public removeCell(cell: HwPixiCell): void {
    this.pixiDungeon.update((dungeon) => ({
      ...dungeon,
      cells: dungeon.cells.filter((someCell) => someCell.x !== cell.x || someCell.y !== cell.y),
    }));
  }

  public updateCell(cell: HwPixiCell): void {
    this.pixiDungeon.update((dungeon) => ({
      ...dungeon,
      cells: dungeon.cells.map((someCell) =>
        someCell.x === cell.x && someCell.y === cell.y ? cell : someCell,
      ),
    }));
  }

  private transformCell(cell: HwPixiCell, cellTransformData: CellTransformData): void {
    this.destroybaseSprite(cell.pixi.baseSprite);
    cell.baseSpritePath = cellTransformData.baseSpritePath;
    cell.pixi.baseSprite = this.createBaseSprite(cell.x, cell.y, cellTransformData.baseSpritePath);
    this.updateCell(cell);
    this.viewportService.viewport.addChild(cell.pixi.baseSprite);
  }

  private destroyCell(cell: HwPixiCell): void {
    this.removeCell(cell);
    this.destroybaseSprite(cell.pixi.baseSprite);
  }
}
