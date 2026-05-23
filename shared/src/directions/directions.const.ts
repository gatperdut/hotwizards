import { SpriteOffset } from '../sprites/sprite-offset.const.js';

export const Directions = ['n', 'e', 's', 'w'] as const;

export type Direction = (typeof Directions)[number];

export const DirectionOffsets: Record<Direction, SpriteOffset> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};
