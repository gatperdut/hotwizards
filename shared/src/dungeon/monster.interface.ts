import { Direction } from '../directions/directions.const.js';
import { MonsterType } from '../sprites/monster-sprites.const.js';

export interface HwMonster {
  name: string;
  type: MonsterType | null;
  spritePath: string | null;
  direction: Direction;
  movement: number;
  attack: number;
  defense: number;
  body: number;
  mind: number;
}
