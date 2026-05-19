export const CornerSpritePaths = [
  '/tiles/corners/corner_n.png',
  '/tiles/corners/corner_e.png',
  '/tiles/corners/corner_s.png',
  '/tiles/corners/corner_w.png',
] as const;

export type CornerSpritePath = (typeof CornerSpritePaths)[number];
