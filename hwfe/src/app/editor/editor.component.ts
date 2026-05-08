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
import { from, switchMap, tap } from 'rxjs';
import { screen2World } from '../shared/coords';
import { fromPixiEvent } from '../shared/from-pixi-event';
import { OverflowService } from '../shared/overflow.service';
import { MapHeight, MapWidth } from './consts/map-size.const';
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

    this.viewportService
      .setup(this.canvasRef)
      .pipe(
        tap(() => {
          this.adventureTemplate = this.activatedRoute.snapshot.data['adventureTemplate'];
        }),
        switchMap(() => {
          return from(this.editorService.dungeon2DungeonPixi(this.adventureTemplate.dungeon)).pipe(
            tap((mapPixi) => {
              this.editorService.map.set(mapPixi);
            }),
          );
        }),
        tap(() => {
          fromPixiEvent<FederatedPointerEvent>(this.viewportService.viewport, 'pointertap')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event): void => {
              this.tap(event);
            });
        }),
        tap(() => {
          this.viewportService.center();

          this.gridService.draw();
        }),
      )
      .subscribe();
  }

  private tap(event: FederatedPointerEvent): void {
    if (this.viewportService.dragging) {
      return;
    }

    const worldPos = this.viewportService.viewport.toWorld(event.global);
    const tilePos = screen2World(worldPos.x, worldPos.y);

    if (tilePos.x < 0 || tilePos.y < 0 || tilePos.x >= MapWidth || tilePos.y >= MapHeight) {
      return;
    }

    this.editorService.editCell(tilePos.x, tilePos.y);
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.gridService.shutdown();
    this.textureService.shutdown();
    this.viewportService.shutdown();
  }
}
