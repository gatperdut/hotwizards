export const FloorSpritePaths = [
  '/tiles/floors/floor_01.png',
  '/tiles/floors/floor_02.png',
  '/tiles/floors/floor_03.png',
  '/tiles/floors/floor_04.png',
  '/tiles/floors/floor_05.png',
  '/tiles/floors/floor_06.png',
  '/tiles/floors/floor_07.png',
  '/tiles/floors/floor_08.png',
  '/tiles/floors/floor_09.png',
  '/tiles/floors/floor_10.png',
  '/tiles/floors/floor_11.png',
  '/tiles/floors/floor_12.png',
] as const;

export type FloorSpritePath = (typeof FloorSpritePaths)[number];
