import { Point } from 'pixi.js';
import { cellHalfH, cellHalfW } from '../editor/consts/cell.const';

export const screen2World = (xScreen: number, yScreen: number): Point => {
  const xWorld = (xScreen / cellHalfW - yScreen / cellHalfH) / 2;
  const yWorld = (xScreen / cellHalfW + yScreen / cellHalfH) / 2;

  return new Point(Math.floor(xWorld), Math.floor(yWorld));
};

export const world2Screen = (xWorld: number, yWorld: number): Point => {
  const xScreen = (yWorld + xWorld) * cellHalfW;
  const yScreen = (yWorld - xWorld) * cellHalfH;

  return new Point(xScreen, yScreen);
};

export const world2Ground = (xWorld: number, yWorld: number): Point => {
  const screen = world2Screen(xWorld, yWorld);

  return new Point(screen.x + cellHalfW, screen.y - cellHalfH);
};

export const ground2World = (xGround: number, yGround: number): Point => {
  return screen2World(xGround - cellHalfW, yGround + cellHalfH);
};

export const groundZIndex = (xWorld: number, yWorld: number, mapWidth: number): number => {
  return mapWidth - 1 - xWorld + yWorld;
};
