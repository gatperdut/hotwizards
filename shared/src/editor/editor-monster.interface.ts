import { Direction } from '../directions/directions.const.js';
import { MonsterType } from '../sprites/monster-sprites.const.js';

export interface HwEditorMonster {
  type: MonsterType | null;
  spritePath: string | null;
  direction: Direction;
}
