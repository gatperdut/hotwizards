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
import { Application, Assets, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
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
    const texture = await Assets.load('/tiles/ground_1.png');

    const sprite = new Sprite(texture);
    sprite.zIndex = 0;
    sprite.position.set(32, -16);

    const sprite2 = new Sprite(texture);
    sprite2.zIndex = -1;

    sprite.setSize(64, 64);
    sprite2.setSize(64, 64);
    this.viewport.addChild(sprite);
    // this.viewport.addChild(sprite2);
    sprite2.x += 32;
    sprite2.y -= 16;

    this.drawGrid();
    this.drawCoordinates();
  }

  private drawGrid(): void {
    const tileW = 64;
    const tileH = 32;
    const cols = this.cols;
    const rows = this.rows;

    const grid = new Graphics();
    grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    // going east
    for (let row = 0; row <= rows; row++) {
      const startX = (0 + row) * (tileW / 2);
      const startY = (0 + row) * (tileH / 2);
      const endX = (rows + row) * (tileW / 2);
      const endY = (rows - row) * (tileH / 2);
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    // going south
    for (let col = 0; col <= cols; col++) {
      const startX = (0 + col) * (tileW / 2);
      const startY = (0 - col) * (tileH / 2);
      const endX = (cols + col) * (tileW / 2);
      const endY = (cols - col) * (tileH / 2);
      grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    grid.stroke();
    this.viewport.addChild(grid);
  }

  private drawCoordinates(): void {
    const tileW = 64;
    const tileH = 32;

    const style = new TextStyle({
      fontSize: 8,
      fill: 0x444444,
    });

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = (row - col) * (tileW / 2);
        const y = (row + col) * (tileH / 2);

        const label = new Text({ text: `${row},${col}`, style });
        label.anchor.set(0.5, 0.5);
        label.x = x;
        label.y = y + tileH / 2;
        this.viewport.addChild(label);
      }
    }
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
