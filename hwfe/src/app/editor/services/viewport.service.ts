import { DestroyRef, DOCUMENT, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Viewport } from 'pixi-viewport';
import { Application, EventEmitter } from 'pixi.js';
import { debounceTime, fromEvent, Observable } from 'rxjs';
import { world2Screen } from '../../shared/coords';
import { MapHeight, MapWidth } from '../consts/map-size.const';

@Injectable()
export class ViewportService {
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  public app = new Application();
  public viewport!: Viewport;
  public window = this.document.defaultView!;
  public dragging = false;

  public setup(): void {
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

    this.fromPixiEvent(this.viewport, 'drag-start')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.startDrag();
      });

    this.fromPixiEvent(this.viewport, 'pinch-start')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.startDrag();
      });

    this.fromPixiEvent(this.viewport, 'drag-end')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.endDrag();
      });

    this.fromPixiEvent(this.viewport, 'pinch-end')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.endDrag();
      });

    fromEvent(this.window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(150))
      .subscribe(() => {
        this.viewport.resize(this.window.innerWidth, this.window.innerHeight);
      });
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

  private fromPixiEvent<T>(target: EventEmitter, event: string): Observable<T> {
    return new Observable<T>((observer) => {
      const handler = (value: T): void => observer.next(value);
      target.on(event, handler);
      return () => target.off(event, handler);
    });
  }

  public shutdown(): void {
    this.app.destroy();
  }
}
