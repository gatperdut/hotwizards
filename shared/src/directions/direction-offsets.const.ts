import { SpriteOffset } from '../sprites/sprite-offset.const.js';
import { Direction } from './directions.const.js';

export const DirectionOffsets: Record<Direction, SpriteOffset> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};
