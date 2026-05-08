import { inject, Injectable, Injector, signal } from '@angular/core';
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

  public dungeon = signal<HwDungeonPixi>(null!);

  public dungeon2PixiDungeon(dungeon: HwDungeon): HwDungeonPixi {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell): HwCellPixi => {
        return this.createPixiCell(cell.x, cell.y, cell.groundSpritePath as GroundSpritePath);
      }),
    };
  }

  public createPixiCell(
    x: number,
    y: number,
    groundSpritePath = GroundSpritePaths[Math.floor(Math.random() * GroundSpritePaths.length)],
  ): HwCellPixi {
    const groundSprite = this.createGroundSprite(x, y, groundSpritePath);

    const cellPixi = {
      x: x,
      y: y,
      groundSpritePath: groundSpritePath,
      pixi: {
        groundSprite: groundSprite,
      },
    };

    cellPixi.pixi.groundSprite.on('pointertap', (event) => {
      event.stopPropagation();
      this.editCell(cellPixi).subscribe();
    });
    this.viewportService.viewport.addChild(cellPixi.pixi.groundSprite);

    return cellPixi;
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

    this.viewportService.viewport.addChild(groundSprite);

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
    return this.dungeon().cells.find((cellPixi) => cellPixi.x === x && cellPixi.y === y);
  }

  public addCell(cellPixi: HwCellPixi): void {
    this.dungeon.update((dungeon) => ({ ...dungeon, cells: [...dungeon.cells, cellPixi] }));
  }

  private transformCell(cellPixi: HwCellPixi, cellData: CellData): void {
    // TODO
  }

  private destroyCell(cellPixi: HwCellPixi): void {
    // TODO
  }
}
