import { AdjacentIcons } from './adjacents/adjacent-icons.const.js';
import { DiagonalIcons } from './diagonals/diagonal-icons.const.js';
import { Direction } from './directions.const.js';

export const DirectionIcons: Record<Direction, string> = {
  ...AdjacentIcons,
  ...DiagonalIcons,
};
