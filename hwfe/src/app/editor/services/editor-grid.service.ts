import { inject, Injectable } from '@angular/core';
import { Container, Graphics } from 'pixi.js';
import { DungeonHeight, DungeonWidth } from '../../map/consts/dungeon-size.const';
import { ViewportService } from '../../map/services/viewport.service';
import { CellHalfH, CellHalfW } from '../../sprites/cell-size.const';

@Injectable()
export class EditorGridService {
  private viewportService = inject(ViewportService);

  public grid = new Graphics();
  public coordinates = new Container();

  public draw(): void {
    this.drawGrid();
  }

  private drawGrid(): void {
    this.grid.zIndex = -1;
    this.grid.setStrokeStyle({ color: 0x444444, pixelLine: true });

    for (let row = 0; row <= DungeonHeight; row++) {
      const startX = (0 + row) * CellHalfW;
      const startY = (0 + row) * CellHalfH;
      const endX = (DungeonHeight + row) * CellHalfW;
      const endY = -(DungeonHeight - row) * CellHalfH;
      this.grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    for (let col = 0; col <= DungeonWidth; col++) {
      const startX = (0 + col) * CellHalfW;
      const startY = (0 - col) * CellHalfH;
      const endX = (DungeonWidth + col) * CellHalfW;
      const endY = (DungeonWidth - col) * CellHalfH;
      this.grid.moveTo(startX, startY).lineTo(endX, endY);
    }

    this.grid.stroke();
    this.viewportService.viewport.addChild(this.grid);
  }

  public shutdown(): void {
    this.grid.destroy(true);
    this.coordinates.destroy(true);
  }
}
