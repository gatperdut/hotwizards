import { SpriteOffset } from '../sprites/sprite-offset.const.js';
import { AdjacentOffsets } from './adjacents/adjacent-offsets.const.js';
import { DiagonalOffsets } from './diagonals/diagonal-offsets.const.js';
import { Direction } from './directions.const.js';

export const DirectionOffsets: Record<Direction, SpriteOffset> = {
  ...AdjacentOffsets,
  ...DiagonalOffsets,
};
