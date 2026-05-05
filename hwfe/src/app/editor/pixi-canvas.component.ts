import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Application, Assets, Sprite } from 'pixi.js';

@Component({
  selector: 'app-pixi-canvas',
  template: `<canvas #canvas></canvas>`,
})
export class PixiCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private app!: Application;

  public ngAfterViewInit(): void {
    void this.init();
  }

  private async init(): Promise<void> {
    this.app = new Application();
    this.app.stage.sortableChildren = true;
    this.app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);

    await this.app.init({
      canvas: this.canvasRef.nativeElement,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
    });

    const texture = await Assets.load('/tiles/ground_1.png');

    const sprite = new Sprite(texture);
    sprite.zIndex = 0;
    const sprite2 = new Sprite(texture);
    sprite2.zIndex = -1;

    sprite.setSize(64, 64);
    sprite2.setSize(64, 64);
    this.app.stage.addChild(sprite);
    this.app.stage.addChild(sprite2);
    sprite2.x += 32;
    sprite2.y -= 16;
  }

  public ngOnDestroy(): void {
    this.app!.destroy();
  }
}
