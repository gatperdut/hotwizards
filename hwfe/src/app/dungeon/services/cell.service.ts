import { Injectable } from '@angular/core';
import { Directions } from '@hw/shared/directions';
import { Sprite } from 'pixi.js';
import { HwfeCell } from '../interfaces/cell.interface';

@Injectable()
export class CellService {
  public sprites(cell: HwfeCell): Sprite[] {
    return [
      cell.pixi.baseSprite,
      ...Directions.map((dir) => cell.pixi.corners[dir]),
      cell.pixi.doorSprite,
      cell.pixi.featureSprite,
      cell.pixi.floorTrapSprite,
      cell.pixi.stairsSprite,
    ].filter((s) => !!s);
  }
}
