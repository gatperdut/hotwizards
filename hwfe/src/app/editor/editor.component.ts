import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assets, FederatedPointerEvent, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { from, Observable, tap } from 'rxjs';
import {
  ground2World,
  groundZIndex,
  screen2World,
  world2Ground,
  world2Screen,
} from '../shared/coords';
import { OverflowService } from '../shared/overflow.service';
import { CellHalfH, CellHalfW } from './consts/cell-size.const';
import { GroundHitArea } from './consts/ground-hit-area.const';
import { MapHeight, MapWidth } from './consts/map-size.const';
import { EditorService } from './services/editor.service';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService, ViewportService],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private overflowService = inject(OverflowService);
  private editorService = inject(EditorService);
  private viewportService = inject(ViewportService);
  private activatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.editorService.map.set(this.activatedRoute.snapshot.data['adventureTemplate']);

    this.overflowService.hide();
  }

  public ngAfterViewInit(): void {
    void this.init().subscribe();
  }

  private init(): Observable<void> {
    return from(
      this.viewportService.app.init({
        canvas: this.canvasRef.nativeElement,
        resizeTo: this.viewportService.window,
        backgroundAlpha: 0,
      }),
    ).pipe(
      tap(() => {
        this.viewportService.setup();

        this.viewportService.viewport.on('pointertap', (e) => {
          if (this.viewportService.dragging) {
            return;
          }

          const worldPos = this.viewportService.viewport.toWorld(e.global);
          const tilePos = screen2World(worldPos.x, worldPos.y);

          if (tilePos.x < 0 || tilePos.y < 0 || tilePos.x >= MapWidth || tilePos.y >= MapHeight) {
            return;
          }

          console.log(`Clicked tile: (${tilePos.x}, ${tilePos.y})`);
        });

        this.viewportService.app.stage.addChild(this.viewportService.viewport);
        this.viewportService.viewport.drag().pinch().wheel();

        this.viewportService.center();

        void this.draw();
      }),
    );
  }

  private async draw(): Promise<void> {
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

    this.drawGrid();
    this.drawCoordinates();
  }

  private drawGrid(): void {
    const grid = new Graphics();
    grid.zIndex = -1;
    grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    for (let row = 0; row <= MapHeight; row++) {
      const startX = (0 + row) * CellHalfW;
      const startY = (0 + row) * CellHalfH;
      const endX = (MapHeight + row) * CellHalfW;
      const endY = -(MapHeight - row) * CellHalfH;
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    for (let col = 0; col <= MapWidth; col++) {
      const startX = (0 + col) * CellHalfW;
      const startY = (0 - col) * CellHalfH;
      const endX = (MapWidth + col) * CellHalfW;
      const endY = (MapWidth - col) * CellHalfH;
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    grid.stroke();
    this.viewportService.viewport.addChild(grid);
  }

  private drawCoordinates(): void {
    const style = new TextStyle({
      fontSize: 8,
      fill: 0x444444,
    });

    for (let y = 0; y < MapHeight; y++) {
      for (let x = 0; x < MapWidth; x++) {
        const label = new Text({ text: `${x},${y}`, style });
        label.zIndex = -1;
        label.anchor.set(0.5, 0.5);
        label.position.copyFrom(world2Screen(x, y));
        this.viewportService.viewport.addChild(label);
      }
    }
  }

  public ngOnDestroy(): void {
    this.overflowService.unhide();
    this.viewportService.shutdown();
  }
}
