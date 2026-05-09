import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { HwDungeon } from '@hw/shared';
import { Sprite } from 'pixi.js';
import { filter, from, Observable, switchMap, tap } from 'rxjs';
import { groundZIndex, world2Ground } from '../../shared/coords';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  CellData,
  CellEditorDialogComponent,
  CellEditorDialogData,
  CellEditorDialogResult,
} from '../cell-editor-dialog/cell-editor-dialog.component';
import { DungeonWidth } from '../consts/dungeon-size.const';
import { GroundHitArea } from '../consts/ground-hit-area.const';
import { HwCellPixi } from '../interfaces/cell-pixi.interface';
import { HwDungeonPixi } from '../interfaces/dungeon-pixi.interface';
import { GroundSpritePath, GroundSpritePaths } from '../types/ground-sprite-paths.const';
import { TextureService } from './texture.service';
import { ViewportService } from './viewport.service';

@Injectable()
export class EditorService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);

  public pixiDungeon = signal<HwDungeonPixi>(null!);

  public dungeon = computed(() => this.pixiDungeon2Dungeon(this.pixiDungeon()));

  public dungeon2PixiDungeon(dungeon: HwDungeon): HwDungeonPixi {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell): HwCellPixi => {
        return this.createPixiCell(cell.x, cell.y, cell.groundSpritePath as GroundSpritePath);
      }),
    };
  }

  public pixiDungeon2Dungeon(dungeon: HwDungeonPixi): HwDungeon {
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
  ): HwCellPixi {
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

  public editCell(cellPixi: HwCellPixi): Observable<CellEditorDialogResult> {
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

    return from(this.dialogService.open(dialog, { cellPixi: cellPixi }, this.injector)).pipe(
      switchMap((dialogRef) => dialogRef.afterClosed$),
      filter((cellData) => cellData !== undefined),
      tap((cellData) => {
        if (cellData === null) {
          this.destroyCell(cellPixi);
          return;
        }

        if (this.findCell(cellPixi.x, cellPixi.y)) {
          this.transformCell(cellPixi, cellData);
        } else {
          this.addCell(cellPixi);
        }
      }),
    );
  }

  private findCell(x: number, y: number): HwCellPixi | undefined {
    return this.pixiDungeon().cells.find((cellPixi) => cellPixi.x === x && cellPixi.y === y);
  }

  public addCell(pixiCell: HwCellPixi): void {
    this.pixiDungeon.update((dungeon) => ({ ...dungeon, cells: [...dungeon.cells, pixiCell] }));
  }

  public removeCell(pixiCell: HwCellPixi): void {
    this.pixiDungeon.update((dungeon) => ({
      ...dungeon,
      cells: dungeon.cells.filter(
        (somePixiCell) => somePixiCell.x !== pixiCell.x || somePixiCell.y !== pixiCell.y,
      ),
    }));
  }

  private transformCell(cellPixi: HwCellPixi, cellData: CellData): void {
    // TODO
  }

  private destroyCell(pixiCell: HwCellPixi): void {
    this.removeCell(pixiCell);
    this.viewportService.viewport.removeChild(pixiCell.pixi.groundSprite);
    pixiCell.pixi.groundSprite.destroy();
  }
}
