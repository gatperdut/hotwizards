import { CornerSpritePath, SpriteOffset } from '@hw/shared/sprites';

export const CornerSpriteSizes: Record<CornerSpritePath, SpriteOffset> = {
  '/tiles/corners/corner_n.png': { x: 30, y: 70 },
  '/tiles/corners/corner_e.png': { x: 30, y: 70 },
  '/tiles/corners/corner_s.png': { x: 30, y: 70 },
  '/tiles/corners/corner_w.png': { x: 30, y: 70 },
} as const;

export const CornerSpriteOffsets: Record<CornerSpritePath, SpriteOffset> = {
  '/tiles/corners/corner_n.png': { x: 12, y: -49 },
  '/tiles/corners/corner_e.png': { x: -13, y: -50 },
  '/tiles/corners/corner_s.png': { x: 14, y: -49 },
  '/tiles/corners/corner_w.png': { x: -16, y: -48 },
} as const;
