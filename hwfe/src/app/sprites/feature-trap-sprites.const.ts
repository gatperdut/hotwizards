import { FeatureTrapSpritePath, SpriteOffset } from '@hw/shared/sprites';
import { BrightRedSpriteTint } from './sprite-tints.const';

export const FeatureTrapSpriteSizes: Record<FeatureTrapSpritePath, SpriteOffset> = {
  '/tiles/feature-traps/feature-trap.png': { x: 20, y: 20 },
} as const;

export const FeatureTrapSpriteOffsets: Record<FeatureTrapSpritePath, SpriteOffset> = {
  '/tiles/feature-traps/feature-trap.png': { x: 0, y: -16 },
} as const;

export const FeatureTrapSpriteTint = BrightRedSpriteTint;
