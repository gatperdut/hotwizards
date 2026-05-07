import { Point } from 'pixi.js';
import { CellHalfH, CellHalfW } from '../editor/consts/cell-size.const';

export const screen2World = (xScreen: number, yScreen: number): Point => {
  const xWorld = (xScreen / CellHalfW - yScreen / CellHalfH) / 2;
  const yWorld = (xScreen / CellHalfW + yScreen / CellHalfH) / 2;

  return new Point(Math.floor(xWorld), Math.floor(yWorld));
};

export const world2Screen = (xWorld: number, yWorld: number): Point => {
  const xScreen = (yWorld + xWorld) * CellHalfW;
  const yScreen = (yWorld - xWorld) * CellHalfH;

  return new Point(xScreen, yScreen);
};

export const world2Ground = (xWorld: number, yWorld: number): Point => {
  const screen = world2Screen(xWorld, yWorld);

  return new Point(screen.x + CellHalfW, screen.y - CellHalfH);
};

export const ground2World = (xGround: number, yGround: number): Point => {
  return screen2World(xGround - CellHalfW, yGround + CellHalfH);
};

export const groundZIndex = (xWorld: number, yWorld: number, mapWidth: number): number => {
  return mapWidth - 1 - xWorld + yWorld;
};
