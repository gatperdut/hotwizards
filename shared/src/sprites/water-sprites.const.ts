export const WaterSpritePaths = [
  '/tiles/waters/water_01.png',
  '/tiles/waters/water_02.png',
  '/tiles/waters/water_03.png',
  '/tiles/waters/water_04.png',
  '/tiles/waters/water_05.png',
  '/tiles/waters/water_06.png',
  '/tiles/waters/water_07.png',
  '/tiles/waters/water_08.png',
  '/tiles/waters/water_09.png',
  '/tiles/waters/water_10.png',
  '/tiles/waters/water_11.png',
  '/tiles/waters/water_12.png',
  '/tiles/waters/water_13.png',
] as const;

export type WaterSpritePath = (typeof WaterSpritePaths)[number];
