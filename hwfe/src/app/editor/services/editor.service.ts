import { inject, Injectable, signal } from '@angular/core';
import { GroundSpritePaths, HwDungeon } from '@hw/shared';
import { Sprite } from 'pixi.js';
import { from, Observable, switchMap, tap } from 'rxjs';
import { groundZIndex, world2Ground } from '../../shared/coords';
import { DialogService, LazyDialog } from '../../ui/dialog/services/dialog.service';
import {
  CellEditorDialogComponent,
  CellEditorDialogData,
  CellEditorDialogResult,
} from '../cell-editor-dialog/cell-editor-dialog.component';
import { DungeonWidth } from '../consts/dungeon-size.const';
import { GroundHitArea } from '../consts/ground-hit-area.const';
import { HwCellPixi } from '../interfaces/cell-pixi.interface';
import { HwDungeonPixi } from '../interfaces/dungeon-pixi.interface';
import { TextureService } from './texture.service';
import { ViewportService } from './viewport.service';

@Injectable()
export class EditorService {
  private textureService = inject(TextureService);
  private viewportService = inject(ViewportService);
  private dialogService = inject(DialogService);

  public dungeon = signal<HwDungeonPixi>(null!);

  public dungeon2DungeonPixi(dungeon: HwDungeon): HwDungeonPixi {
    return {
      ...dungeon,
      cells: dungeon.cells.map((cell): HwCellPixi => {
        return this.create(cell.x, cell.y, cell.groundSpritePath);
      }),
    };
  }

  public create(
    x: number,
    y: number,
    groundSpritePath = GroundSpritePaths[Math.floor(Math.random() * GroundSpritePaths.length)],
  ): HwCellPixi {
    const groundSprite = new Sprite(this.textureService.textures[groundSpritePath]);
    groundSprite.zIndex = groundZIndex(x, y, DungeonWidth);
    groundSprite.position.copyFrom(world2Ground(x, y));
    groundSprite.setSize(64, 64);
    groundSprite.anchor.set(0.5, 0.5);
    groundSprite.eventMode = 'static';
    groundSprite.cursor = 'pointer';
    groundSprite.hitArea = GroundHitArea;
    this.viewportService.viewport.addChild(groundSprite);

    const cell: HwCellPixi = {
      x: x,
      y: y,
      groundSpritePath: groundSpritePath,
      pixi: {
        groundSprite: groundSprite,
      },
    };

    groundSprite.on('pointertap', (event) => {
      event.stopPropagation();
      this.editCell(cell).pipe(tap((editedCell) => {}));
    });

    return cell;
  }

  public editCell(cell: HwCellPixi): Observable<CellEditorDialogResult> {
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

    return from(this.dialogService.open(dialog, { cell: cell })).pipe(
      switchMap((dialogRef) => dialogRef.afterClosed$),
    );
  }

  public add(cellPixi: HwCellPixi): void {
    this.dungeon.update((dungeon) => ({ ...dungeon, cells: [...dungeon.cells, cellPixi] }));
  }
}
