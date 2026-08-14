import { DoorTrapSpritePath, SpriteOffset } from '@hw/shared/sprites';
import { BrightRedSpriteTint } from './sprite-tints.const';

export const DoorTrapSpriteSizes: Record<DoorTrapSpritePath, SpriteOffset> = {
  '/tiles/feature-traps/feature-trap.png': { x: 20, y: 20 },
} as const;

export const DoorTrapSpriteOffsets: Record<DoorTrapSpritePath, SpriteOffset> = {
  '/tiles/feature-traps/feature-trap.png': { x: 0, y: -16 },
} as const;

export const DoorTrapSpriteTint = BrightRedSpriteTint;
