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
import { GroundHitArea } from '../consts/ground-hit-area.const';
import { HwPixiCell } from '../interfaces/pixi-cell.interface';
import { HwPixiDungeon } from '../interfaces/pixi-dungeon.interface';
import { GroundSpritePath, GroundSpritePaths } from '../types/ground-sprite-paths.const';
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
        return this.createPixiCell(cell.x, cell.y, cell.groundSpritePath as GroundSpritePath);
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
        groundSpritePath: cell.groundSpritePath,
      })),
    };
  }

  public createPixiCell(
    x: number,
    y: number,
    groundSpritePath = GroundSpritePaths[Math.floor(Math.random() * GroundSpritePaths.length)],
  ): HwPixiCell {
    const groundSprite = this.createGroundSprite(x, y, groundSpritePath);

    const pixiCell = {
      x: x,
      y: y,
      groundSpritePath: groundSpritePath,
      pixi: {
        groundSprite: groundSprite,
      },
    };

    pixiCell.pixi.groundSprite.on('pointertap', (event) => {
      event.stopPropagation();
      this.editCell(pixiCell).subscribe();
    });
    this.viewportService.viewport.addChild(pixiCell.pixi.groundSprite);

    return pixiCell;
  }

  public createGroundSprite(x: number, y: number, groundSpritePath: GroundSpritePath): Sprite {
    const groundSprite = new Sprite(this.textureService.textures[groundSpritePath]);
    groundSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    groundSprite.position.copyFrom(world2Ground(x, y));
    groundSprite.setSize(64, 64);
    groundSprite.anchor.set(0.5, 0.5);
    groundSprite.eventMode = 'static';
    groundSprite.cursor = 'pointer';
    groundSprite.hitArea = GroundHitArea;

    return groundSprite;
  }

  public destroyGroundSprite(groundSprite: Sprite): void {
    this.viewportService.viewport.removeChild(groundSprite);
    groundSprite.destroy();
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
    this.destroyGroundSprite(cell.pixi.groundSprite);
    cell.groundSpritePath = cellTransformData.groundSpritePath;
    cell.pixi.groundSprite = this.createGroundSprite(
      cell.x,
      cell.y,
      cellTransformData.groundSpritePath,
    );
    this.updateCell(cell);
    this.viewportService.viewport.addChild(cell.pixi.groundSprite);
  }

  private destroyCell(cell: HwPixiCell): void {
    this.removeCell(cell);
    this.destroyGroundSprite(cell.pixi.groundSprite);
  }
}
