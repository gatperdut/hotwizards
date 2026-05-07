import { DestroyRef, DOCUMENT, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Viewport } from 'pixi-viewport';
import { Application } from 'pixi.js';
import { debounceTime, fromEvent } from 'rxjs';
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

    this.viewport.on('drag-start', () => {
      this.startDrag();
    });

    this.viewport.on('drag-end', () => {
      this.endDrag();
    });

    this.viewport.on('pinch-start', () => {
      this.startDrag();
    });

    this.viewport.on('pinch-end', () => {
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
}
