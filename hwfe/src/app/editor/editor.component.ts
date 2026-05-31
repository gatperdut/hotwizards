import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { HwAdventureTemplate } from '@hw/shared/adventure-templates';
import { FederatedPointerEvent } from 'pixi.js';
import { forkJoin, tap } from 'rxjs';
import { CanvasLoadingComponent } from '../map/canvas-loading/canvas-loading.component';
import { screen2World } from '../map/consts/coords.const.';
import {
  DungeonHalfHeight,
  DungeonHalfWidth,
  DungeonHeight,
  DungeonWidth,
} from '../map/consts/dungeon-size.const';
import { fromPixiEvent } from '../map/consts/from-pixi-event.const';
import { OverflowService } from '../map/services/overflow.service';
import { TextureService } from '../map/services/texture.service';
import { ViewportService } from '../map/services/viewport.service';
import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
import { EditorGridService } from './services/editor-grid.service';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-editor',
  imports: [CanvasLoadingComponent, EditorSidebarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService, ViewportService, EditorGridService, TextureService],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private overflowService = inject(OverflowService);
  public editorService = inject(EditorService);
  private viewportService = inject(ViewportService);
  private gridService = inject(EditorGridService);
  private textureService = inject(TextureService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public loading = signal(true);

  public ngAfterViewInit(): void {
    void this.init();
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.gridService.shutdown();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }

  private init(): void {
    this.overflowService.hide();

    forkJoin([this.textureService.setup(), this.viewportService.setup(this.canvasRef)])
      .pipe(
        tap(() => {
          const adventureTemplate: HwAdventureTemplate =
            this.activatedRoute.snapshot.data['adventureTemplate'];
          this.editorService.setup(adventureTemplate);
        }),
        tap(() => {
          fromPixiEvent<FederatedPointerEvent>(this.viewportService.viewport, 'pointertap')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event): void => {
              event.stopPropagation();
              this.tapEmptyCell(event);
            });
        }),
        tap(() => {
          this.gridService.draw();

          this.centerMiddle();

          this.loading.set(false);
        }),
      )
      .subscribe();
  }

  private centerMiddle(): void {
    const cells = this.editorService.hwfeEditorDungeon().cells;

    if (!cells.length) {
      this.viewportService.center(DungeonHalfWidth, DungeonHalfHeight);
      return;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    cells.forEach((cell) => {
      if (cell.x < minX) {
        minX = cell.x;
      }
      if (cell.x > maxX) {
        maxX = cell.x;
      }
      if (cell.y < minY) {
        minY = cell.y;
      }
      if (cell.y > maxY) {
        maxY = cell.y;
      }
    });

    this.viewportService.center(Math.round((maxX - minX) / 2), Math.floor((maxY - minY) / 2));
  }

  private tapEmptyCell(event: FederatedPointerEvent): void {
    if (this.viewportService.dragging) {
      return;
    }

    const worldCoords = this.viewportService.viewport.toWorld(event.global);
    const cellCoords = screen2World(worldCoords.x, worldCoords.y);

    if (
      cellCoords.x < 0 ||
      cellCoords.y >= DungeonWidth ||
      cellCoords.y < 0 ||
      cellCoords.y >= DungeonHeight
    ) {
      return;
    }

    if (this.editorService.findCell(cellCoords.x, cellCoords.y)) {
      return;
    }

    this.editorService.addCell(
      this.editorService.createHwfeEditorCell(
        cellCoords.x,
        cellCoords.y,
        undefined,
        { spritePath: null, trapped: false },
        undefined,
        { type: null, spritePath: null, direction: 'w' },
        null,
        null,
        { n: false, e: false, s: false, w: false },
        false,
        null,
      ),
    );
  }
}
