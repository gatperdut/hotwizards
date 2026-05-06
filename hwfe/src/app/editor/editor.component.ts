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
  Point,
  Polygon,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js';
import { from, Observable, tap } from 'rxjs';
import { OverflowService } from '../shared/overflow.service';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  providers: [OverflowService],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private document = inject(DOCUMENT);
  private overflowService = inject(OverflowService);

  private app = new Application();
  private viewport!: Viewport;
  private window = this.document.defaultView!;

  private tileW = 64;
  private tileH = 32;
  private halfW = this.tileW / 2;
  private halfH = this.tileH / 2;
  private cols = 10;
  private rows = 10;

  public ngOnInit(): void {
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
          const tilePos = this.screen2World(worldPos.x, worldPos.y);

          if (tilePos.x < 0 || tilePos.y < 0 || tilePos.x >= this.cols || tilePos.y >= this.rows) {
            return;
          }

          console.log(`Clicked tile: (${tilePos.x}, ${tilePos.y})`);
          alert(`Clicked tile: (${tilePos.x}, ${tilePos.y})`);
        });

        this.app.stage.addChild(this.viewport);
        this.viewport.drag({}).pinch().wheel();
        this.centerViewport();
      }),
    );

    // this.app.stage.position.set(this.window.innerWidth / 2, this.window.innerHeight / 2);
  }

  private async draw(): Promise<void> {
    const texture1 = await Assets.load('/tiles/ground/ground_01.png');
    const texture2 = await Assets.load('/tiles/ground/ground_02.png');
    const texture3 = await Assets.load('/tiles/ground/ground_03.png');
    const texture4 = await Assets.load('/tiles/ground/ground_04.png');

    const hitArea = new Polygon([-128, -32, 0, -128, 128, -32, 128, 96, 0, 128, -128, 96]);

    const event = (e: FederatedPointerEvent) => {
      e.stopPropagation();
      alert(this.ground2World(sprite.position.x, sprite.position.y));
      console.log('Sprite clicked!', this.ground2World(sprite.position.x, sprite.position.y));
    };

    const sprite = new Sprite(texture1);
    sprite.zIndex = this.groundZIndex(5, 2);
    sprite.position.copyFrom(this.world2Ground(5, 2));
    sprite.setSize(64, 64);
    sprite.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite);
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.hitArea = hitArea;
    sprite.on('pointertap', event);

    const sprite2 = new Sprite(texture2);
    sprite2.zIndex = this.groundZIndex(6, 2);
    sprite2.position.copyFrom(this.world2Ground(6, 2));
    sprite2.setSize(64, 64);
    sprite2.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite2);
    sprite2.eventMode = 'static';
    sprite2.cursor = 'pointer';
    sprite2.hitArea = hitArea;
    sprite2.on('pointertap', event);

    const sprite3 = new Sprite(texture3);
    sprite3.zIndex = this.groundZIndex(5, 3);
    sprite3.position.copyFrom(this.world2Ground(5, 3));
    sprite3.setSize(64, 64);
    sprite3.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite3);
    sprite3.eventMode = 'static';
    sprite3.cursor = 'pointer';
    sprite3.hitArea = hitArea;
    sprite3.on('pointertap', event);

    const sprite4 = new Sprite(texture4);
    sprite4.zIndex = this.groundZIndex(6, 3);
    sprite4.position.copyFrom(this.world2Ground(6, 3));
    sprite4.setSize(64, 64);
    sprite4.anchor.set(0.5, 0.5);
    this.viewport.addChild(sprite4);
    sprite4.eventMode = 'static';
    sprite4.cursor = 'pointer';
    sprite4.hitArea = hitArea;
    sprite4.on('pointertap', (e) => {
      e.stopPropagation();
      console.log('Sprite clicked!', this.ground2World(sprite4.position.x, sprite4.position.y));
    });

    this.drawGrid();
    this.drawCoordinates();
  }

  private drawGrid(): void {
    const cols = this.cols;
    const rows = this.rows;

    const grid = new Graphics();
    grid.zIndex = -1;
    grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    // going east
    for (let row = 0; row <= rows; row++) {
      const startX = (0 + row) * this.halfW;
      const startY = (0 + row) * this.halfH;
      const endX = (rows + row) * this.halfW;
      const endY = -(rows - row) * this.halfH;
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    // going south
    for (let col = 0; col <= cols; col++) {
      const startX = (0 + col) * this.halfW;
      const startY = (0 - col) * this.halfH;
      const endX = (cols + col) * this.halfW;
      const endY = (cols - col) * this.halfH;
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

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const label = new Text({ text: `${x},${y}`, style });
        label.zIndex = -1;
        label.anchor.set(0.5, 0.5);
        label.position.copyFrom(this.world2Screen(x, y));
        this.viewport.addChild(label);
      }
    }
  }

  private screen2World(xScreen: number, yScreen: number): Point {
    const xWorld = (xScreen / this.halfW - yScreen / this.halfH) / 2;
    const yWorld = (xScreen / this.halfW + yScreen / this.halfH) / 2;

    return new Point(Math.floor(xWorld), Math.floor(yWorld));
  }

  private world2Screen(xWorld: number, yWorld: number): Point {
    const xScreen = (yWorld + xWorld) * this.halfW;
    const yScreen = (yWorld - xWorld) * this.halfH;

    return new Point(xScreen, yScreen);
  }

  private world2Ground(xWorld: number, yWorld: number): Point {
    const screen = this.world2Screen(xWorld, yWorld);

    return new Point(screen.x + this.halfW, screen.y - this.halfH);
  }

  private ground2World(xGround: number, yGround: number): Point {
    return this.screen2World(xGround - this.halfW, yGround + this.halfH);
  }

  private groundZIndex(xWorld: number, yWorld: number): number {
    return this.cols - 1 - xWorld + yWorld;
  }

  private centerViewport(): void {
    const centerX = this.cols / 2;
    const centerY = this.rows / 2;
    const centerPoint = this.world2Screen(centerX, centerY);
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
