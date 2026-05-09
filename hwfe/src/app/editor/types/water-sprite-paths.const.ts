export const WaterSpritePaths = [
  '/tiles/water/water_01.png',
  '/tiles/water/water_02.png',
  '/tiles/water/water_03.png',
  '/tiles/water/water_04.png',
  '/tiles/water/water_05.png',
  '/tiles/water/water_06.png',
  '/tiles/water/water_07.png',
  '/tiles/water/water_08.png',
  '/tiles/water/water_09.png',
  '/tiles/water/water_10.png',
  '/tiles/water/water_11.png',
  '/tiles/water/water_12.png',
  '/tiles/water/water_13.png',
] as const;

export type WaterSpritePath = (typeof WaterSpritePaths)[number];
