import { SpriteOffset, StairsSpritePath } from '@hw/shared/sprites';

export const StairsSpriteSizes: Record<StairsSpritePath, SpriteOffset> = {
  '/tiles/stairs/stairs_s.png': { x: 64, y: 64 },
  '/tiles/stairs/stairs_w.png': { x: 64, y: 64 },
} as const;

export const StairsSpriteOffsets: Record<StairsSpritePath, SpriteOffset> = {
  '/tiles/stairs/stairs_s.png': { x: 0, y: -31 },
  '/tiles/stairs/stairs_w.png': { x: 0, y: -31 },
} as const;
