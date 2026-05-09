import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { HwDungeon } from '@hw/shared';
import { FederatedPointerEvent, Sprite } from 'pixi.js';
import { filter, from, Observable, switchMap, take, tap } from 'rxjs';
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
import { FeatureSpritePath } from '../types/feature-sprite-paths.const';
import { FloorSpritePath, FloorSpritePaths } from '../types/floor-sprite-paths.const';
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
      cells: dungeon.cells.map(({ pixi: _pixi, ...cell }) => cell),
    };
  }

  public createPixiCell(
    x: number,
    y: number,
    baseSpritePath: BaseSpritePath = FloorSpritePaths[
      Math.floor(Math.random() * FloorSpritePaths.length)
    ],
  ): HwPixiCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);

    const cell: HwPixiCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      featureSpritePath: null,
      traversable: FloorSpritePaths.includes(baseSpritePath as FloorSpritePath),
      pixi: {
        baseSprite: baseSprite,
      },
    };

    cell.pixi.baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, cell));

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

    this.viewportService.viewport.addChild(baseSprite);

    return baseSprite;
  }

  public createFeatureSprite(x: number, y: number, featureSpritePath: FeatureSpritePath): Sprite {
    const featureSprite = new Sprite(this.textureService.textures[featureSpritePath]);
    featureSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    featureSprite.position.copyFrom(world2Ground(x, y));
    featureSprite.setSize(64, 64);
    featureSprite.anchor.set(0.5, 0.5);
    featureSprite.eventMode = 'none';

    this.viewportService.viewport.addChild(featureSprite);

    return featureSprite;
  }

  public destroySprite(baseSprite: Sprite): void {
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

  public findCell(x: number, y: number): HwPixiCell | undefined {
    return this.pixiDungeon().cells.find((cell) => cell.x === x && cell.y === y);
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
    if (cell.baseSpritePath !== cellTransformData.baseSpritePath) {
      cell.baseSpritePath = cellTransformData.baseSpritePath;
      this.destroySprite(cell.pixi.baseSprite);
      cell.pixi.baseSprite = this.createBaseSprite(
        cell.x,
        cell.y,
        cellTransformData.baseSpritePath,
      );
      cell.pixi.baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, cell));
    }
    if (cell.featureSpritePath !== cellTransformData.featureSpritePath) {
      if (cell.featureSpritePath) {
        this.destroySprite(cell.pixi.featureSprite as Sprite);
      }
      cell.featureSpritePath = cellTransformData.featureSpritePath;
      if (cellTransformData.featureSpritePath) {
        cell.pixi.featureSprite = this.createFeatureSprite(
          cell.x,
          cell.y,
          cellTransformData.featureSpritePath,
        );
      }
    }
    this.updateCell(cell);
  }

  private destroyCell(cell: HwPixiCell): void {
    this.removeCell(cell);
    this.destroySprite(cell.pixi.baseSprite);
  }

  private baseSpriteTap(event: FederatedPointerEvent, cell: HwPixiCell): void {
    event.stopPropagation();
    this.editCell(cell).pipe(take(1)).subscribe();
  }
}
