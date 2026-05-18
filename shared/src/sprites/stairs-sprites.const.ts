export const StairsSpritePaths = [
  '/tiles/stairs/stairs_s.png',
  '/tiles/stairs/stairs_w.png',
] as const;

export type StairsSpritePath = (typeof StairsSpritePaths)[number];
