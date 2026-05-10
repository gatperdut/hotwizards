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
import { cellIsTraversable } from '../consts/cell-is-traversable.const';
import { DungeonWidth } from '../consts/dungeon-size.const';
import { BaseSpriteHitArea } from '../consts/ground-hit-area.const';
import {
  BaseSpriteOffsets,
  BaseSpritePath,
  BaseSpriteSizes,
} from '../consts/sprite-paths/base-sprite-paths.const';
import {
  DoorSpriteOffsets,
  DoorSpritePath,
  DoorSpriteSizes,
} from '../consts/sprite-paths/door-sprite-paths.const';
import {
  FeatureSpriteOffsets,
  FeatureSpritePath,
  FeatureSpriteSizes,
} from '../consts/sprite-paths/feature-sprite-paths.const';
import { FloorSpritePaths } from '../consts/sprite-paths/floor-sprite-paths.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { HwPixiDungeon } from '../interfaces/pixi-dungeon.interface';
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
      cells: dungeon.cells.map(
        (cell): HwPixiCell =>
          this.createPixiCell(
            cell.x,
            cell.y,
            cell.baseSpritePath as BaseSpritePath,
            cell.featureSpritePath as FeatureSpritePath,
            cell.doorSpritePath as DoorSpritePath,
          ),
      ),
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
    featureSpritePath: FeatureSpritePath | null = null,
    doorSpritePath: DoorSpritePath | null = null,
  ): HwPixiCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);
    const featureSprite = featureSpritePath
      ? this.createFeatureSprite(x, y, featureSpritePath)
      : null;
    const doorSprite = doorSpritePath ? this.createDoorSprite(x, y, doorSpritePath) : null;

    const cell: HwPixiCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      featureSpritePath: featureSpritePath,
      doorSpritePath: doorSpritePath,
      traversable: cellIsTraversable({
        baseSpritePath: baseSpritePath,
        featureSpritePath: featureSpritePath,
      }),
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        doorSprite: doorSprite,
      },
    };

    cell.pixi.baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, cell));

    return cell;
  }

  public createBaseSprite(x: number, y: number, baseSpritePath: BaseSpritePath): Sprite {
    const baseSprite = new Sprite(this.textureService.textures[baseSpritePath]);
    baseSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    baseSprite.position.copyFrom(world2Ground(x, y));
    baseSprite.setSize(BaseSpriteSizes[baseSpritePath].x, BaseSpriteSizes[baseSpritePath].y);
    baseSprite.position.x += BaseSpriteOffsets[baseSpritePath].x;
    baseSprite.position.y += BaseSpriteOffsets[baseSpritePath].y;
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
    featureSprite.setSize(
      FeatureSpriteSizes[featureSpritePath].x,
      FeatureSpriteSizes[featureSpritePath].y,
    );
    featureSprite.position.x += FeatureSpriteOffsets[featureSpritePath].x;
    featureSprite.position.y += FeatureSpriteOffsets[featureSpritePath].y;
    featureSprite.anchor.set(0.5, 0.5);
    featureSprite.eventMode = 'none';

    this.viewportService.viewport.addChild(featureSprite);

    return featureSprite;
  }

  public createDoorSprite(x: number, y: number, doorSpritePath: DoorSpritePath): Sprite {
    const doorSprite = new Sprite(this.textureService.textures[doorSpritePath]);
    doorSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    doorSprite.position.copyFrom(world2Ground(x, y));
    doorSprite.setSize(DoorSpriteSizes[doorSpritePath].x, DoorSpriteSizes[doorSpritePath].y);
    doorSprite.position.x += DoorSpriteOffsets[doorSpritePath].x;
    doorSprite.position.y += DoorSpriteOffsets[doorSpritePath].y;
    doorSprite.anchor.set(0.5, 0.5);
    doorSprite.eventMode = 'none';

    this.viewportService.viewport.addChild(doorSprite);

    return doorSprite;
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
    if (cell.doorSpritePath !== cellTransformData.doorSpritePath) {
      if (cell.doorSpritePath) {
        this.destroySprite(cell.pixi.doorSprite as Sprite);
      }
      cell.doorSpritePath = cellTransformData.doorSpritePath;
      if (cellTransformData.doorSpritePath) {
        cell.pixi.doorSprite = this.createDoorSprite(
          cell.x,
          cell.y,
          cellTransformData.doorSpritePath,
        );
      }
    }
    this.updateCell(cell);
  }

  private destroyCell(cell: HwPixiCell): void {
    this.removeCell(cell);
    this.destroySprite(cell.pixi.baseSprite);
    if (cell.pixi.featureSprite) {
      this.destroySprite(cell.pixi.featureSprite);
    }
    if (cell.pixi.doorSprite) {
      this.destroySprite(cell.pixi.doorSprite);
    }
  }

  private baseSpriteTap(event: FederatedPointerEvent, cell: HwPixiCell): void {
    if (this.viewportService.dragging) {
      return;
    }

    event.stopPropagation();
    this.editCell(cell).pipe(take(1)).subscribe();
  }
}
