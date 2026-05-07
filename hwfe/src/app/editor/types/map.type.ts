import { Graphics } from 'pixi.js';
import { Cell } from './cell.type';

export type Map = {
  width: number;
  height: number;
  cells: Cell[];
};

export type MapPixi = Map & {
  pixi: {
    grid: Graphics;
  };
};
