import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Viewport } from 'pixi-viewport';
import { Application, Assets, Sprite } from 'pixi.js';

@Component({
  selector: 'app-pixi-canvas',
  template: `<canvas #canvas></canvas>`,
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private app!: Application;

  public ngAfterViewInit(): void {
    void this.init();
  }

  private async init(): Promise<void> {
    // 1. Initialize Pixi v8 Application
    const app = new Application();
    await app.init({
      canvas: this.canvasRef.nativeElement,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
    });
    document.body.appendChild(app.canvas);

    // 2. Create the Viewport
    // Note: In v8, 'events' comes from app.renderer.events
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 6400,
      worldHeight: 3200,
      events: app.renderer.events,
    });

    // 3. Add the viewport to the stage
    app.stage.addChild(viewport);

    // this.app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);

    // 4. Activate behaviors
    viewport
      .drag() // click and drag to pan
      .pinch() // touch gesture zoom
      .wheel() // mouse wheel zoom
      .decelerate(); // adds "friction" so it glides when you let go

    const texture = await Assets.load('/tiles/ground_1.png');

    const sprite = new Sprite(texture);
    sprite.zIndex = 0;
    const sprite2 = new Sprite(texture);
    sprite2.zIndex = -1;

    sprite.setSize(64, 64);
    sprite2.setSize(64, 64);
    viewport.addChild(sprite);
    viewport.addChild(sprite2);
    sprite2.x += 32;
    sprite2.y -= 16;
  }

  public ngOnDestroy(): void {
    this.app!.destroy();
  }
}
