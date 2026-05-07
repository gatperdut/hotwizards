import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Viewport } from 'pixi-viewport';
import {
  Application,
  Assets,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js';
import { from, Observable, tap } from 'rxjs';
import {
  ground2World,
  groundZIndex,
  screen2World,
  world2Ground,
  world2Screen,
} from '../shared/coords';
import { OverflowService } from '../shared/overflow.service';
import { cellHalfH, cellHalfW } from './consts/cell.const';
import { groundHitArea } from './consts/ground-hit-area.const';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService, EditorService],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private document = inject(DOCUMENT);
  private overflowService = inject(OverflowService);
  private editorService = inject(EditorService);

  private app = new Application();
  private viewport!: Viewport;
  private window = this.document.defaultView!;

  public ngOnInit(): void {
    this.editorService.map.set({ width: 10, height: 10, cells: [] });

    this.overflowService.hide();
  }

  public ngAfterViewInit(): void {
    void this.init()
      .pipe(
        tap(() => {
          this.window.addEventListener('resize', this.onResize);
          void this.draw();
        }),
      )
      .subscribe();
  }

  private dragging = false;

  private init(): Observable<void> {
    return from(
      this.app.init({
        canvas: this.canvasRef.nativeElement,
        resizeTo: this.window,
        backgroundAlpha: 0,
      }),
    ).pipe(
      tap(() => {
        this.viewport = new Viewport({
          screenWidth: this.window.innerWidth,
          screenHeight: this.window.innerHeight,
          worldWidth: 6400,
          worldHeight: 3200,
          events: this.app.renderer.events,
        });
        this.viewport.sortableChildren = true;

        this.viewport.on('drag-start', () => {
          this.dragging = true;
        });

        this.viewport.on('drag-end', () => {
          setTimeout(() => {
            this.dragging = false;
          }, 50);
        });

        this.viewport.on('pointertap', (e) => {
          if (this.dragging) {
            return;
          }

          const worldPos = this.viewport.toWorld(e.global);
          const tilePos = screen2World(worldPos.x, worldPos.y);

          if (
            tilePos.x < 0 ||
            tilePos.y < 0 ||
            tilePos.x >= this.editorService.map().width ||
            tilePos.y >= this.editorService.map().height
          ) {
            return;
          }

          console.log(`Clicked tile: (${tilePos.x}, ${tilePos.y})`);
        });

        this.app.stage.addChild(this.viewport);
        this.viewport.drag({}).pinch().wheel();
        this.centerViewport();
      }),
    );
  }

  private async draw(): Promise<void> {
    const texture1 = await Assets.load('/tiles/ground/ground_01.png');
    const texture2 = await Assets.load('/tiles/ground/ground_02.png');
    const texture3 = await Assets.load('/tiles/ground/ground_03.png');
    const texture4 = await Assets.load('/tiles/ground/ground_04.png');

    const event = (e: FederatedPointerEvent) => {
      e.stopPropagation();
      console.log('Sprite clicked!', ground2World(sprite.position.x, sprite.position.y));
    };

    const sprite = new Sprite(texture1);
    sprite.zIndex = groundZIndex(5, 2, this.editorService.map().width);
    sprite.position.copyFrom(world2Ground(5, 2));
    sprite.setSize(64, 64);
    sprite.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite);
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.hitArea = groundHitArea;
    sprite.on('pointertap', event);

    const sprite2 = new Sprite(texture2);
    sprite2.zIndex = groundZIndex(6, 2, this.editorService.map().width);
    sprite2.position.copyFrom(world2Ground(6, 2));
    sprite2.setSize(64, 64);
    sprite2.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite2);
    sprite2.eventMode = 'static';
    sprite2.cursor = 'pointer';
    sprite2.hitArea = groundHitArea;
    sprite2.on('pointertap', event);

    const sprite3 = new Sprite(texture3);
    sprite3.zIndex = groundZIndex(5, 3, this.editorService.map().width);
    sprite3.position.copyFrom(world2Ground(5, 3));
    sprite3.setSize(64, 64);
    sprite3.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite3);
    sprite3.eventMode = 'static';
    sprite3.cursor = 'pointer';
    sprite3.hitArea = groundHitArea;
    sprite3.on('pointertap', event);

    const sprite4 = new Sprite(texture4);
    sprite4.zIndex = groundZIndex(6, 3, this.editorService.map().width);
    sprite4.position.copyFrom(world2Ground(6, 3));
    sprite4.setSize(64, 64);
    sprite4.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite4);
    sprite4.eventMode = 'static';
    sprite4.cursor = 'pointer';
    sprite4.hitArea = groundHitArea;
    sprite4.on('pointertap', (e) => {
      e.stopPropagation();
      console.log('Sprite clicked!', ground2World(sprite4.position.x, sprite4.position.y));
    });

    this.drawGrid();
    this.drawCoordinates();
  }

  private drawGrid(): void {
    const cols = this.editorService.map().width;
    const rows = this.editorService.map().height;

    const grid = new Graphics();
    grid.zIndex = -1;
    grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    // going east
    for (let row = 0; row <= rows; row++) {
      const startX = (0 + row) * cellHalfW;
      const startY = (0 + row) * cellHalfH;
      const endX = (rows + row) * cellHalfW;
      const endY = -(rows - row) * cellHalfH;
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    // going south
    for (let col = 0; col <= cols; col++) {
      const startX = (0 + col) * cellHalfW;
      const startY = (0 - col) * cellHalfH;
      const endX = (cols + col) * cellHalfW;
      const endY = (cols - col) * cellHalfH;
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    grid.stroke();
    this.viewport.addChild(grid);
  }

  private drawCoordinates(): void {
    const style = new TextStyle({
      fontSize: 8,
      fill: 0x444444,
    });

    for (let y = 0; y < this.editorService.map().height; y++) {
      for (let x = 0; x < this.editorService.map().width; x++) {
        const label = new Text({ text: `${x},${y}`, style });
        label.zIndex = -1;
        label.anchor.set(0.5, 0.5);
        label.position.copyFrom(world2Screen(x, y));
        this.viewport.addChild(label);
      }
    }
  }

  private centerViewport(): void {
    const centerX = this.editorService.map().width / 2;
    const centerY = this.editorService.map().height / 2;
    const centerPoint = world2Screen(centerX, centerY);
    this.viewport.moveCenter(centerPoint.x, centerPoint.y);
  }

  private onResize = (): void => {
    this.viewport.resize(this.window.innerWidth, this.window.innerHeight);
  };

  public ngOnDestroy(): void {
    this.window.removeEventListener('resize', this.onResize);
    this.overflowService.unhide();
    this.app?.destroy();
  }
}
