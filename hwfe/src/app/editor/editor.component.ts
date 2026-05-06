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
import { Application, Assets, Graphics, Point, Sprite, Text, TextStyle } from 'pixi.js';
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

        this.app.stage.addChild(this.viewport);
        this.viewport.drag().pinch().wheel().decelerate();
      }),
    );

    // this.app.stage.position.set(this.window.innerWidth / 2, this.window.innerHeight / 2);
  }

  private async draw(): Promise<void> {
    const texture1 = await Assets.load('/tiles/ground/ground_01.png');
    const texture2 = await Assets.load('/tiles/ground/ground_02.png');
    const texture3 = await Assets.load('/tiles/ground/ground_03.png');
    const texture4 = await Assets.load('/tiles/ground/ground_04.png');

    const sprite = new Sprite(texture1);
    sprite.zIndex = this.groundZIndex(5, 2);
    sprite.position.copyFrom(this.world2Ground(5, 2));
    sprite.setSize(64, 64);
    this.viewport.addChild(sprite);

    const sprite2 = new Sprite(texture2);
    sprite2.zIndex = this.groundZIndex(6, 2);
    sprite2.position.copyFrom(this.world2Ground(6, 2));
    sprite2.setSize(64, 64);
    this.viewport.addChild(sprite2);

    const sprite3 = new Sprite(texture3);
    sprite3.zIndex = this.groundZIndex(5, 3);
    sprite3.position.copyFrom(this.world2Ground(5, 3));
    sprite3.setSize(64, 64);
    this.viewport.addChild(sprite3);

    const sprite4 = new Sprite(texture4);
    sprite4.zIndex = this.groundZIndex(6, 3);
    sprite4.position.copyFrom(this.world2Ground(6, 3));
    sprite4.setSize(64, 64);
    this.viewport.addChild(sprite4);

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
      const startX = (0 + row) * (this.tileW / 2);
      const startY = (0 + row) * (this.tileH / 2);
      const endX = (rows + row) * (this.tileW / 2);
      const endY = -(rows - row) * (this.tileH / 2);
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    // going south
    for (let col = 0; col <= cols; col++) {
      const startX = (0 + col) * (this.tileW / 2);
      const startY = (0 - col) * (this.tileH / 2);
      const endX = (cols + col) * (this.tileW / 2);
      const endY = (cols - col) * (this.tileH / 2);
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

  private world2Screen(xWorld: number, yWorld: number): Point {
    const xScreen = (yWorld + xWorld) * (this.tileW / 2);
    const yScreen = (yWorld - xWorld) * (this.tileH / 2);

    return new Point(xScreen, yScreen);
  }

  private world2Ground(xWorld: number, yWorld: number): Point {
    const world = this.world2Screen(xWorld, yWorld);
    return new Point(world.x, world.y - this.tileH * 1.5);
  }

  private groundZIndex(xWorld: number, yWorld: number): number {
    return this.cols - 1 - xWorld + yWorld;
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
