import { SpriteOffset } from '../../sprites/sprite-offset.const.js';
import { Adjacent } from './adjacents.const.js';

export const AdjacentOffsets: Record<Adjacent, SpriteOffset> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};
