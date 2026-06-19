import { Injectable } from '@angular/core';
import { Adjacents } from '@hw/shared/directions';
import { Sprite } from 'pixi.js';
import { HwfeCell } from '../interfaces/cell.interface';

@Injectable()
export class CellService {
  public sprites(cell: HwfeCell): Sprite[] {
    return [
      cell.pixi.baseSprite,
      ...Adjacents.map((adj) => cell.pixi.corners[adj]),
      cell.pixi.doorSprite,
      cell.pixi.featureSprite,
      cell.pixi.floorTrapSprite,
      cell.pixi.stairsSprite,
    ].filter((s) => !!s);
  }
}
