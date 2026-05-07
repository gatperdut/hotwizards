import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Assets, FederatedPointerEvent, Sprite } from 'pixi.js';
import { tap } from 'rxjs';
import { ground2World, groundZIndex, screen2World, world2Ground } from '../shared/coords';
import { fromPixiEvent } from '../shared/from-pixi-event';
import { OverflowService } from '../shared/overflow.service';
import { GroundHitArea } from './consts/ground-hit-area.const';
import { MapHeight, MapWidth } from './consts/map-size.const';
import { EditorService } from './services/editor.service';
import { GridService } from './services/grid.service';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService, ViewportService, GridService],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private overflowService = inject(OverflowService);
  private editorService = inject(EditorService);
  private viewportService = inject(ViewportService);
  private gridService = inject(GridService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.editorService.map.set(this.activatedRoute.snapshot.data['adventureTemplate'].map);

    this.overflowService.hide();
  }

  public ngAfterViewInit(): void {
    void this.init();
  }

  private init(): void {
    this.viewportService
      .setup(this.canvasRef)
      .pipe(
        tap(() => {
          fromPixiEvent<FederatedPointerEvent>(this.viewportService.viewport, 'pointertap')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event): void => {
              this.tap(event);
            });

          this.viewportService.center();

          void this.draw();
        }),
      )
      .subscribe();
  }

  private async draw(): Promise<void> {
    this.gridService.drawGrid(this.viewportService.viewport);
    this.gridService.drawCoordinates(this.viewportService.viewport);

    const texture1 = await Assets.load('/tiles/ground/ground_01.png');
    const texture2 = await Assets.load('/tiles/ground/ground_02.png');
    const texture3 = await Assets.load('/tiles/ground/ground_03.png');
    const texture4 = await Assets.load('/tiles/ground/ground_04.png');

    const event = (e: FederatedPointerEvent): void => {
      e.stopPropagation();
      console.log('Sprite clicked!', ground2World(sprite.position.x, sprite.position.y));
    };

    const sprite = new Sprite(texture1);
    sprite.zIndex = groundZIndex(5, 2, MapWidth);
    sprite.position.copyFrom(world2Ground(5, 2));
    sprite.setSize(64, 64);
    sprite.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite);
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.hitArea = GroundHitArea;
    sprite.on('pointertap', event);

    const sprite2 = new Sprite(texture2);
    sprite2.zIndex = groundZIndex(6, 2, MapWidth);
    sprite2.position.copyFrom(world2Ground(6, 2));
    sprite2.setSize(64, 64);
    sprite2.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite2);
    sprite2.eventMode = 'static';
    sprite2.cursor = 'pointer';
    sprite2.hitArea = GroundHitArea;
    sprite2.on('pointertap', event);

    const sprite3 = new Sprite(texture3);
    sprite3.zIndex = groundZIndex(5, 3, MapWidth);
    sprite3.position.copyFrom(world2Ground(5, 3));
    sprite3.setSize(64, 64);
    sprite3.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite3);
    sprite3.eventMode = 'static';
    sprite3.cursor = 'pointer';
    sprite3.hitArea = GroundHitArea;
    sprite3.on('pointertap', event);

    const sprite4 = new Sprite(texture4);
    sprite4.zIndex = groundZIndex(6, 3, MapWidth);
    sprite4.position.copyFrom(world2Ground(6, 3));
    sprite4.setSize(64, 64);
    sprite4.anchor.set(0.5, 0.5);
    this.viewportService.viewport.addChild(sprite4);
    sprite4.eventMode = 'static';
    sprite4.cursor = 'pointer';
    sprite4.hitArea = GroundHitArea;
    sprite4.on('pointertap', (e) => {
      e.stopPropagation();
      console.log('Sprite clicked!', ground2World(sprite4.position.x, sprite4.position.y));
    });
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
    this.viewportService.shutdown();
  }
}
