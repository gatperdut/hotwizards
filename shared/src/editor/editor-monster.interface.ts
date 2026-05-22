import { Direction } from '../directions/directions.const.js';
import { MonsterType } from '../dungeon/creatures/monsters/monster-type.const.js';

export interface HwEditorMonster {
  type: MonsterType | null;
  spritePath: string | null;
  direction: Direction;
}
