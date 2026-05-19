import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { HwCorners, HwDungeon, HwFeature, HwMonster, HwSecondary } from '@hw/shared/editor';
import {
  BaseSpritePath,
  CornerSpritePath,
  DoorSpritePath,
  FeatureSpritePath,
  FeatureSpriteSecondaries,
  FeatureTrapSpritePath,
  FloorSpritePaths,
  FloorTrapSpritePath,
  MonsterSpritePath,
  SpawnSpritePath,
  SpritePath,
  StairsSpritePath,
} from '@hw/shared/sprites';
import { FederatedPointerEvent, Sprite } from 'pixi.js';
import { filter, from, Observable, switchMap, take, tap } from 'rxjs';
import { Directions } from '../../../../../shared/dist/shared/src/directions/directions.const';
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
import { FeatureSpriteZIndex } from '../consts/sprites/feature-sprites.const';
import { SpriteOffsets, SpriteSizes } from '../consts/sprites/sprites.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { HwPixiCorners } from '../interfaces/pixi-corners.interface';
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

    if (this.pixiDungeon()?.cells.filter((cell) => cell.stairsSpritePath).length !== 1) {
      result.push('There must be exactly 1 set of stairs.');
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
            cell.baseSpritePath,
            cell.feature,
            cell.doorSpritePath,
            cell.monster,
            cell.floorTrapSpritePath,
            cell.stairsSpritePath,
            cell.corners,
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
    feature: HwFeature,
    doorSpritePath: DoorSpritePath | null = null,
    monster: HwMonster,
    floorTrapSpritePath: FloorTrapSpritePath | null = null,
    stairsSpritePath: StairsSpritePath | null = null,
    corners: HwCorners,
    spawn: boolean,
    secondary: HwSecondary | null,
  ): HwPixiCell {
    const baseSprite = this.createBaseSprite(x, y, baseSpritePath);
    const featureSprite = feature.spritePath
      ? this.createFeatureSprite(x, y, feature.spritePath)
      : null;
    const featureTrapSprite = feature.trapped
      ? this.createFeatureTrapSprite(x, y, '/tiles/feature-traps/feature-trap.png')
      : null;
    const doorSprite = doorSpritePath ? this.createDoorSprite(x, y, doorSpritePath) : null;
    const monsterSprite = monster.spritePath
      ? this.createMonsterSprite(x, y, monster.spritePath as MonsterSpritePath)
      : null;
    const floorTrapSprite = floorTrapSpritePath
      ? this.createFloorTrapSprite(x, y, floorTrapSpritePath)
      : null;
    const stairsSprite = stairsSpritePath ? this.createStairsSprite(x, y, stairsSpritePath) : null;
    const pixiCorners: HwPixiCorners = {
      n: corners.n ? this.createCornerSprite(x, y, '/tiles/corners/corner_n.png') : null,
      e: corners.e ? this.createCornerSprite(x, y, '/tiles/corners/corner_e.png') : null,
      s: corners.s ? this.createCornerSprite(x, y, '/tiles/corners/corner_s.png') : null,
      w: corners.w ? this.createCornerSprite(x, y, '/tiles/corners/corner_w.png') : null,
    };
    const spawnSprite = spawn ? this.createSpawnSprite(x, y, '/tiles/spawns/spawn.png') : null;

    const cell: HwPixiCell = {
      x: x,
      y: y,
      baseSpritePath: baseSpritePath,
      feature: feature,
      doorSpritePath: doorSpritePath,
      monster: monster,
      floorTrapSpritePath: floorTrapSpritePath,
      stairsSpritePath: stairsSpritePath,
      corners: corners,
      spawn: spawn,
      secondary: secondary,
      traversable: cellIsTraversable({
        baseSpritePath: baseSpritePath,
        feature: { spritePath: feature.spritePath },
        secondary: secondary,
      }),
      pixi: {
        baseSprite: baseSprite,
        featureSprite: featureSprite,
        featureTrapSprite: featureTrapSprite,
        doorSprite: doorSprite,
        monsterSprite: monsterSprite,
        floorTrapSprite: floorTrapSprite,
        stairsSprite: stairsSprite,
        corners: pixiCorners,
        spawnSprite: spawnSprite,
      },
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
    featureSprite.zIndex += FeatureSpriteZIndex;
    featureSprite.eventMode = 'none';
    return featureSprite;
  }

  private createFeatureTrapSprite(
    x: number,
    y: number,
    featureTrapSpritePath: FeatureTrapSpritePath,
  ): Sprite {
    const featureTrapSprite = this.createSprite(x, y, featureTrapSpritePath);
    featureTrapSprite.zIndex += FeatureSpriteZIndex;
    featureTrapSprite.eventMode = 'none';
    featureTrapSprite.tint = 0xbbbbbb;
    return featureTrapSprite;
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

  private createFloorTrapSprite(
    x: number,
    y: number,
    floorTrapSpritePath: FloorTrapSpritePath,
  ): Sprite {
    const floorTrapSprite = this.createSprite(x, y, floorTrapSpritePath);
    floorTrapSprite.eventMode = 'none';
    floorTrapSprite.tint = 0xbb3333;
    return floorTrapSprite;
  }

  private createStairsSprite(x: number, y: number, stairsSpritePath: StairsSpritePath): Sprite {
    const stairsSprite = this.createSprite(x, y, stairsSpritePath);
    stairsSprite.eventMode = 'none';
    return stairsSprite;
  }

  private createCornerSprite(x: number, y: number, cornerSpritePath: CornerSpritePath): Sprite {
    const cornerSprite = this.createSprite(x, y, cornerSpritePath);
    cornerSprite.eventMode = 'none';
    return cornerSprite;
  }

  private createSpawnSprite(x: number, y: number, spawnSpritePath: SpawnSpritePath): Sprite {
    const spawnSprite = this.createSprite(x, y, spawnSpritePath);
    spawnSprite.eventMode = 'none';
    spawnSprite.tint = 0xbbbbbb;
    return spawnSprite;
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
    if (cell.feature.spritePath !== cellTransformData.featureSpritePath) {
      if (cell.feature.spritePath) {
        this.destroySprite(cell.pixi.featureSprite!);
      }
      cell.feature.spritePath = cellTransformData.featureSpritePath;
      if (cellTransformData.featureSpritePath) {
        cell.pixi.featureSprite = this.createFeatureSprite(
          cell.x,
          cell.y,
          cellTransformData.featureSpritePath,
        );
      }
    }
    if (cell.pixi.featureTrapSprite) {
      this.destroySprite(cell.pixi.featureTrapSprite);
    }
    cell.feature.trapped = cellTransformData.featureTrapped;
    if (cell.feature.spritePath && cellTransformData.featureTrapped) {
      cell.pixi.featureTrapSprite = this.createFeatureTrapSprite(
        cell.x,
        cell.y,
        '/tiles/feature-traps/feature-trap.png',
      );
    }
    if (cell.doorSpritePath !== cellTransformData.doorSpritePath) {
      if (cell.doorSpritePath) {
        this.destroySprite(cell.pixi.doorSprite!);
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
        this.destroySprite(cell.pixi.monsterSprite!);
      }
      cell.monster.type = cellTransformData.monsterType;
      cell.monster.spritePath = cellTransformData.monsterSpritePath;
      cell.monster.direction = cellTransformData.monsterDirection;
      if (cellTransformData.monsterType) {
        cell.pixi.monsterSprite = this.createMonsterSprite(
          cell.x,
          cell.y,
          cellTransformData.monsterSpritePath!,
        );
      }
    }
    if (cell.floorTrapSpritePath !== cellTransformData.floorTrapSpritePath) {
      if (cell.floorTrapSpritePath) {
        this.destroySprite(cell.pixi.floorTrapSprite!);
      }
      cell.floorTrapSpritePath = cellTransformData.floorTrapSpritePath;
      if (cellTransformData.floorTrapSpritePath) {
        cell.pixi.floorTrapSprite = this.createFloorTrapSprite(
          cell.x,
          cell.y,
          cellTransformData.floorTrapSpritePath,
        );
      }
    }
    cell.traversable = cellIsTraversable(cell);
    if (cell.stairsSpritePath !== cellTransformData.stairsSpritePath) {
      if (cell.stairsSpritePath) {
        this.destroySprite(cell.pixi.stairsSprite!);
      }
      cell.stairsSpritePath = cellTransformData.stairsSpritePath;
      if (cellTransformData.stairsSpritePath) {
        cell.pixi.stairsSprite = this.createStairsSprite(
          cell.x,
          cell.y,
          cellTransformData.stairsSpritePath,
        );
      }
    }

    const cornersAux = {
      n: cellTransformData.cornerN,
      e: cellTransformData.cornerE,
      s: cellTransformData.cornerS,
      w: cellTransformData.cornerW,
    };
    Directions.forEach((dir) => {
      if (cell.corners[dir] !== cornersAux[dir]) {
        if (cell.corners[dir]) {
          this.destroySprite(cell.pixi.corners[dir]!);
        }
        cell.corners[dir] = cornersAux[dir];
        if (cornersAux[dir]) {
          cell.pixi.corners[dir] = this.createCornerSprite(
            cell.x,
            cell.y,
            `/tiles/corners/corner_${dir}.png`,
          );
        }
      }
    });

    if (cell.spawn !== cellTransformData.spawn) {
      if (cell.spawn) {
        this.destroySprite(cell.pixi.spawnSprite!);
      }
      cell.spawn = cellTransformData.spawn;
      if (cellTransformData.spawn) {
        cell.pixi.spawnSprite = this.createSpawnSprite(cell.x, cell.y, '/tiles/spawns/spawn.png');
      }
    }

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
      FeatureSpriteSecondaries[cell.feature.spritePath!].map((offset) => {
        this.findCell(cell.x + offset.x, cell.y + offset.y)!.secondary = null;
      });
    }
    if (cell.pixi.featureTrapSprite) {
      this.destroySprite(cell.pixi.featureTrapSprite);
    }
    if (cell.pixi.doorSprite) {
      this.destroySprite(cell.pixi.doorSprite);
    }
    if (cell.monster.type) {
      cell.monster.type = null;
      cell.monster.spritePath = null;
      this.destroySprite(cell.pixi.monsterSprite!);
    }
    if (cell.pixi.floorTrapSprite) {
      this.destroySprite(cell.pixi.floorTrapSprite);
    }
    if (cell.pixi.stairsSprite) {
      this.destroySprite(cell.pixi.stairsSprite);
    }
    Directions.forEach((dir) => {
      if (cell.pixi.corners[dir]) {
        this.destroySprite(cell.pixi.corners[dir]);
      }
    });
    if (cell.pixi.spawnSprite) {
      this.destroySprite(cell.pixi.spawnSprite);
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
