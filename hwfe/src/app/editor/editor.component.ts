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
import { FederatedPointerEvent } from 'pixi.js';
import { forkJoin, tap } from 'rxjs';
import { screen2World } from '../shared/coords';
import { fromPixiEvent } from '../shared/from-pixi-event';
import { OverflowService } from '../shared/overflow.service';
import { DungeonHeight, DungeonWidth } from './consts/dungeon-size.const';
import { EditorSidebarComponent } from './editor-sidebar/editor-sidebar.component';
import { EditorService } from './services/editor.service';
import { GridService } from './services/grid.service';
import { TextureService } from './services/texture.service';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-editor',
  imports: [EditorSidebarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService, ViewportService, GridService, TextureService],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private overflowService = inject(OverflowService);
  public editorService = inject(EditorService);
  public viewportService = inject(ViewportService);
  private gridService = inject(GridService);
  private textureService = inject(TextureService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    void this.init();
  }

  private init(): void {
    this.overflowService.hide();

    forkJoin([this.textureService.setup(), this.viewportService.setup(this.canvasRef)])
      .pipe(
        tap(() => {
          const adventureTemplate = this.activatedRoute.snapshot.data['adventureTemplate'];
          this.editorService.adventureTemplate.set(adventureTemplate);
          this.editorService.pixiDungeon.set(
            this.editorService.dungeon2PixiDungeon(adventureTemplate.dungeon),
          );
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
          this.viewportService.viewport.setZoom(3);
          this.viewportService.center(9, 21);
        }),
      )
      .subscribe();
  }

  private tapEmptyCell(event: FederatedPointerEvent): void {
    if (this.viewportService.dragging) {
      return;
    }

    const world = this.viewportService.viewport.toWorld(event.global);
    const cell = screen2World(world.x, world.y);

    if (cell.x < 0 || cell.y >= DungeonWidth || cell.y < 0 || cell.y >= DungeonHeight) {
      return;
    }

    if (this.editorService.findCell(cell.x, cell.y)) {
      return;
    }

    this.editorService.addCell(
      this.editorService.createPixiCell(
        cell.x,
        cell.y,
        undefined,
        { spritePath: null, trapped: false },
        undefined,
        { type: null, spritePath: null, direction: 'w' },
        null,
        false,
        null,
      ),
    );
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.gridService.shutdown();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }
}
