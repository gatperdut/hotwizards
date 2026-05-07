import { Injectable } from '@angular/core';
import { Viewport } from 'pixi-viewport';
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { world2Screen } from '../../shared/coords';
import { CellHalfH, CellHalfW } from '../consts/cell-size.const';
import { MapHeight, MapWidth } from '../consts/map-size.const';

@Injectable()
export class GridService {
  public grid = new Graphics();
  public coordinates = new Container();

  public drawGrid(viewport: Viewport): void {
    this.grid.zIndex = -1;
    this.grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    for (let row = 0; row <= MapHeight; row++) {
      const startX = (0 + row) * CellHalfW;
      const startY = (0 + row) * CellHalfH;
      const endX = (MapHeight + row) * CellHalfW;
      const endY = -(MapHeight - row) * CellHalfH;
      this.grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    for (let col = 0; col <= MapWidth; col++) {
      const startX = (0 + col) * CellHalfW;
      const startY = (0 - col) * CellHalfH;
      const endX = (MapWidth + col) * CellHalfW;
      const endY = (MapWidth - col) * CellHalfH;
      this.grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    this.grid.stroke();
    viewport.addChild(this.grid);
  }

  public drawCoordinates(viewport: Viewport): void {
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
        this.coordinates.addChild(label);
      }
    }

    viewport.addChild(this.coordinates);
  }
}
