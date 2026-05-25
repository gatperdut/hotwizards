import { MonsterSpritePath } from '../../../sprites/monster-sprites.const.js';
import { HwCreature } from '../creature.interface.js';
import { MonsterType } from './monster-type.const.js';

export interface HwMonster extends HwCreature {
  alignment: 'MONSTER';
  spritePath: MonsterSpritePath;
  type: MonsterType | null;
}
