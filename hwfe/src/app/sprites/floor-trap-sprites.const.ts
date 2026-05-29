import { FloorTrapSpritePath, SpriteOffset } from '@hw/shared/sprites';
import { BrightRedSpriteTint } from './sprite-tints.const';

export const FloorTrapSpriteSizes: Record<FloorTrapSpritePath, SpriteOffset> = {
  '/tiles/traps/pit.png': { x: 44, y: 44 },
  '/tiles/traps/spikes_1.png': { x: 64, y: 64 },
  '/tiles/traps/spikes_2.png': { x: 64, y: 64 },
  '/tiles/traps/spikes_3.png': { x: 64, y: 64 },
  '/tiles/traps/boulder.png': { x: 48, y: 48 },
} as const;

export const FloorTrapSpriteOffsets: Record<FloorTrapSpritePath, SpriteOffset> = {
  '/tiles/traps/pit.png': { x: -1, y: -15 },
  '/tiles/traps/spikes_1.png': { x: 0, y: -25 },
  '/tiles/traps/spikes_2.png': { x: 0, y: -25 },
  '/tiles/traps/spikes_3.png': { x: 0, y: -25 },
  '/tiles/traps/boulder.png': { x: 0, y: -30 },
} as const;

export const FloorTrapSpriteTint = BrightRedSpriteTint;
