import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwDungeon, HwMonster, HwSecondary } from '@hw/shared/editor';
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
import { BaseSpritePath } from '../consts/sprite-paths/base-sprite-paths.const';
import { DoorSpritePath } from '../consts/sprite-paths/door-sprite-paths.const';
import {
  FeatureSpritePath,
  FeatureSpriteSecondaries,
} from '../consts/sprite-paths/feature-sprite-paths.const';
import { FloorSpritePaths } from '../consts/sprite-paths/floor-sprite-paths.const';
import { MonsterSpritePath } from '../consts/sprite-paths/monster-sprite-paths.const';
import { SpriteOffsets, SpritePath, SpriteSizes } from '../consts/sprite-paths/sprite-paths.const';
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

  public adventureTemplate = signal<HwAdventureTemplate>(null!);

  public pixiDungeon = signal<HwPixiDungeon>(null!);

  public dungeon = computed(() => this.pixiDungeon2Dungeon(this.pixiDungeon()));

  public errors = computed<string[]>(() => {
    const result: string[] = [];

    if (this.pixiDungeon()?.cells.filter((cell) => cell.spawn).length !== 4) {
      result.push('There must be exactly 4 spawn cells.');
    }

    return result;
  });

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
            cell.monster,
            cell.spawn,
            cell.secondary,
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
    monster: HwMonster,
    spawn: boolean,
    secondary: HwSecondary | null,
  ): HwPixiCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);
    const featureSprite = featureSpritePath
      ? this.createFeatureSprite(x, y, featureSpritePath)
      : null;
    const doorSprite = doorSpritePath ? this.createDoorSprite(x, y, doorSpritePath) : null;
    const monsterSprite = monster.spritePath
      ? this.createMonsterSprite(x, y, monster.spritePath as MonsterSpritePath)
      : null;

    const cell: HwPixiCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      featureSpritePath: featureSpritePath,
      doorSpritePath: doorSpritePath,
      monster: monster,
      traversable: cellIsTraversable({
        baseSpritePath: baseSpritePath,
        featureSpritePath: featureSpritePath,
        secondary: secondary,
      }),
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        doorSprite: doorSprite,
        monsterSprite: monsterSprite,
      },
      spawn: spawn,
      secondary: secondary,
    };

    cell.pixi.baseSprite.on('pointertap', (event) => this.baseSpriteTap(event, cell));

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

  private createFeatureSprite(x: number, y: number, featureSpritePath: FeatureSpritePath): Sprite {
    const featureSprite = this.createSprite(x, y, featureSpritePath);
    featureSprite.eventMode = 'none';
    return featureSprite;
  }

  private createDoorSprite(x: number, y: number, doorSpritePath: DoorSpritePath): Sprite {
    const doorSprite = this.createSprite(x, y, doorSpritePath);
    doorSprite.eventMode = 'none';
    return doorSprite;
  }

  private createMonsterSprite(x: number, y: number, monsterSpritePath: MonsterSpritePath): Sprite {
    const monsterSprite = this.createSprite(x, y, monsterSpritePath);
    monsterSprite.eventMode = 'none';
    return monsterSprite;
  }

  public destroySprite(sprite: Sprite): void {
    this.viewportService.viewport.removeChild(sprite);
    sprite.destroy();
  }

  private editCell(cell: HwPixiCell): Observable<CellEditorDialogResult> {
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

  private removeCell(cell: HwPixiCell): void {
    this.pixiDungeon.update((dungeon) => ({
      ...dungeon,
      cells: dungeon.cells.filter((someCell) => someCell.x !== cell.x || someCell.y !== cell.y),
    }));
  }

  private updateCell(cell: HwPixiCell): void {
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
    if (
      cell.monster.type !== cellTransformData.monsterType ||
      cell.monster.direction !== cellTransformData.monsterDirection
    ) {
      if (cell.monster.type) {
        this.destroySprite(cell.pixi.monsterSprite as Sprite);
      }
      cell.monster.type = cellTransformData.monsterType;
      cell.monster.spritePath = cellTransformData.monsterSpritePath;
      cell.monster.direction = cellTransformData.monsterDirection;
      if (cellTransformData.monsterType) {
        cell.pixi.monsterSprite = this.createMonsterSprite(
          cell.x,
          cell.y,
          cellTransformData.monsterSpritePath as MonsterSpritePath,
        );
      }
    }
    cell.traversable = cellIsTraversable(cell);
    cell.spawn = cellTransformData.spawn;
    cellTransformData.unmadeSecondary.forEach((affectedCell) => {
      this.findCell(affectedCell.x, affectedCell.y)!.secondary = null;
    });
    cellTransformData.madeSecondary.forEach((affectedCell) => {
      this.findCell(affectedCell.x, affectedCell.y)!.secondary = { x: cell.x, y: cell.y };
    });
    this.updateCell(cell);
  }

  private destroyCell(cell: HwPixiCell): void {
    this.removeCell(cell);
    this.destroySprite(cell.pixi.baseSprite);
    if (cell.pixi.featureSprite) {
      this.destroySprite(cell.pixi.featureSprite);
      FeatureSpriteSecondaries[cell.featureSpritePath as FeatureSpritePath].map((offset) => {
        this.findCell(cell.x + offset.x, cell.y + offset.y)!.secondary = null;
      });
    }
    if (cell.pixi.doorSprite) {
      this.destroySprite(cell.pixi.doorSprite);
    }
    if (cell.monster.type) {
      cell.monster.type = null;
      cell.monster.spritePath = null;
      this.destroySprite(cell.pixi.monsterSprite as Sprite);
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
