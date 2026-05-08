import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared';
import { FederatedPointerEvent } from 'pixi.js';
import { filter, forkJoin, tap } from 'rxjs';
import { screen2World } from '../shared/coords';
import { fromPixiEvent } from '../shared/from-pixi-event';
import { OverflowService } from '../shared/overflow.service';
import { CellData } from './cell-editor-dialog/cell-editor-dialog.component';
import { DungeonHeight, DungeonWidth } from './consts/dungeon-size.const';
import { EditorService } from './services/editor.service';
import { GridService } from './services/grid.service';
import { TextureService } from './services/texture.service';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService, ViewportService, GridService, TextureService],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private overflowService = inject(OverflowService);
  private editorService = inject(EditorService);
  private viewportService = inject(ViewportService);
  private gridService = inject(GridService);
  private textureService = inject(TextureService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private adventureTemplate!: HwAdventureTemplate;

  public ngAfterViewInit(): void {
    void this.init();
  }

  private init(): void {
    this.overflowService.hide();

    forkJoin([this.textureService.setup(), this.viewportService.setup(this.canvasRef)])
      .pipe(
        tap(() => {
          this.adventureTemplate = this.activatedRoute.snapshot.data['adventureTemplate'];
          this.editorService.dungeon.set(
            this.editorService.dungeon2PixiDungeon(this.adventureTemplate.dungeon),
          );
        }),
        tap(() => {
          fromPixiEvent<FederatedPointerEvent>(this.viewportService.viewport, 'pointertap')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event): void => {
              this.tapEmptyCell(event);
            });
        }),
        tap(() => {
          this.viewportService.center();

          this.gridService.draw();
        }),
      )
      .subscribe();
  }

  private tapEmptyCell(event: FederatedPointerEvent): void {
    if (this.viewportService.dragging) {
      return;
    }

    const worldPos = this.viewportService.viewport.toWorld(event.global);
    const tilePos = screen2World(worldPos.x, worldPos.y);

    if (tilePos.x < 0 || tilePos.y < 0 || tilePos.x >= DungeonWidth || tilePos.y >= DungeonHeight) {
      return;
    }

    const cellPixi = this.editorService.createPixiCell(tilePos.x, tilePos.y);
    this.editorService.editCell(cellPixi).pipe(
      filter((cellData) => cellData !== undefined && cellData !== null),
      tap((cellData: CellData) => {}),
    );
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.gridService.shutdown();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }
}
