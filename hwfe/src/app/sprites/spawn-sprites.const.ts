import { SpawnSpritePath, SpriteOffset } from '@hw/shared/sprites';
import { BrightGreenSpriteTint } from './sprite-tints.const';

export const SpawnSpriteSizes: Record<SpawnSpritePath, SpriteOffset> = {
  '/tiles/spawns/spawn.png': { x: 20, y: 20 },
} as const;

export const SpawnSpriteOffsets: Record<SpawnSpritePath, SpriteOffset> = {
  '/tiles/spawns/spawn.png': { x: 0, y: -18 },
} as const;

export const SpawnSpriteTint = BrightGreenSpriteTint;
