export const GroundSpritePaths = [
  '/tiles/ground/ground_01.png',
  '/tiles/ground/ground_02.png',
  '/tiles/ground/ground_03.png',
  '/tiles/ground/ground_04.png',
  '/tiles/ground/ground_05.png',
  '/tiles/ground/ground_06.png',
  '/tiles/ground/ground_07.png',
  '/tiles/ground/ground_08.png',
  '/tiles/ground/ground_09.png',
  '/tiles/ground/ground_10.png',
  '/tiles/ground/ground_11.png',
  '/tiles/ground/ground_12.png',
] as const;

export type GroundSpritePath = (typeof GroundSpritePaths)[number];
