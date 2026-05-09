export const FloorSpritePaths = [
  '/tiles/floor/floor_01.png',
  '/tiles/floor/floor_02.png',
  '/tiles/floor/floor_03.png',
  '/tiles/floor/floor_04.png',
  '/tiles/floor/floor_05.png',
  '/tiles/floor/floor_06.png',
  '/tiles/floor/floor_07.png',
  '/tiles/floor/floor_08.png',
  '/tiles/floor/floor_09.png',
  '/tiles/floor/floor_10.png',
  '/tiles/floor/floor_11.png',
  '/tiles/floor/floor_12.png',
] as const;

export type FloorSpritePath = (typeof FloorSpritePaths)[number];
