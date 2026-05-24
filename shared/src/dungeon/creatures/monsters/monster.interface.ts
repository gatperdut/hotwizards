import { MonsterSpritePath } from '../../../sprites/monster-sprites.const.js';
import { HwCreature } from '../../cells/creature.interface.js';
import { MonsterType } from './monster-type.const.js';

export interface HwMonster extends HwCreature {
  alignment: 'MONSTER';
  spritePath: MonsterSpritePath;
  type: MonsterType | null;
}
