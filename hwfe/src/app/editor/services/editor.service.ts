import { Injectable, signal } from '@angular/core';
import { HwCell, HwMap } from '@hw/shared';

@Injectable()
export class EditorService {
  public map = signal<HwMap>({ cells: [] });

  public editCell(x: number, y: number): void {
    const cell = this.cellAt(x, y);

    console.log(cell);
  }

  private cellAt(x: number, y: number): HwCell | undefined {
    return this.map().cells.find((c) => c.x === x && c.y === y);
  }
}
