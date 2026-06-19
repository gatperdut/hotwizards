import { Adjacents } from './adjacents/adjacents.const.js';
import { Diagonals } from './diagonals/diagonals.const.js';

export const Directions = [...Adjacents, ...Diagonals] as const;

export type Direction = (typeof Directions)[number];
