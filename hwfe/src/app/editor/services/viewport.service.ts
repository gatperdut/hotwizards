import { DestroyRef, DOCUMENT, ElementRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Viewport } from 'pixi-viewport';
import { Application, FederatedPointerEvent } from 'pixi.js';
import { debounceTime, from, fromEvent, Observable, tap } from 'rxjs';
import { world2Screen } from '../../shared/coords';
import { fromPixiEvent } from '../../shared/from-pixi-event';
import { MapHeight, MapWidth } from '../consts/map-size.const';

@Injectable()
export class ViewportService {
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  public app = new Application();
  public viewport!: Viewport;
  public window = this.document.defaultView!;
  public dragging = false;

  public setup(canvasRef: ElementRef<HTMLCanvasElement>): Observable<void> {
    return from(
      this.app.init({
        canvas: canvasRef.nativeElement,
        resizeTo: this.window,
        backgroundAlpha: 0,
      }),
    ).pipe(
      tap(() => {
        this.viewport = new Viewport({
          screenWidth: this.window.innerWidth,
          screenHeight: this.window.innerHeight,
          worldWidth: this.window.innerWidth,
          worldHeight: this.window.innerHeight,
          events: this.app.renderer.events,
        });

        this.viewport.sortableChildren = true;

        this.app.stage.addChild(this.viewport);
        this.viewport.drag().pinch().wheel();

        fromPixiEvent<FederatedPointerEvent>(this.viewport, 'drag-start')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.startDrag();
          });

        fromPixiEvent<FederatedPointerEvent>(this.viewport, 'pinch-start')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.startDrag();
          });

        fromPixiEvent<FederatedPointerEvent>(this.viewport, 'drag-end')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.endDrag();
          });

        fromPixiEvent<FederatedPointerEvent>(this.viewport, 'pinch-end')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.endDrag();
          });

        fromEvent(this.window, 'resize')
          .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(150))
          .subscribe(() => {
            this.viewport.resize(this.window.innerWidth, this.window.innerHeight);
          });
      }),
    );
  }

  public center(x = MapWidth / 2, y = MapHeight / 2): void {
    const centerPoint = world2Screen(x, y);
    this.viewport.moveCenter(centerPoint.x, centerPoint.y);
  }

  private startDrag(): void {
    this.dragging = true;
  }

  private endDrag(): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);
  }

  public shutdown(): void {
    this.app.destroy();
  }
}
