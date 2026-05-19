import { CornerSpritePath, SpriteOffset } from '@hw/shared/sprites';

export const CornerSpriteSizes: Record<CornerSpritePath, SpriteOffset> = {
  '/tiles/corners/corner_n.png': { x: 128, y: 32 },
  '/tiles/corners/corner_e.png': { x: 128, y: 32 },
  '/tiles/corners/corner_s.png': { x: 128, y: 32 },
  '/tiles/corners/corner_w.png': { x: 128, y: 32 },
} as const;

export const CornerSpriteOffsets: Record<CornerSpritePath, SpriteOffset> = {
  '/tiles/corners/corner_n.png': { x: 0, y: 0 },
  '/tiles/corners/corner_e.png': { x: 0, y: 0 },
  '/tiles/corners/corner_s.png': { x: 0, y: 0 },
  '/tiles/corners/corner_w.png': { x: 0, y: 0 },
} as const;
