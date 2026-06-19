import { SpriteOffset } from '../../sprites/sprite-offset.const.js';
import { Diagonal } from './diagonals.const.js';

export const DiagonalOffsets: Record<Diagonal, SpriteOffset> = {
  ne: { x: 1, y: -1 },
  se: { x: 1, y: 1 },
  sw: { x: -1, y: 1 },
  nw: { x: -1, y: -1 },
};
