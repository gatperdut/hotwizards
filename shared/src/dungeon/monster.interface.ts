import { MonsterType } from '../monsters/monster-type.const.js';
import { HwCreature } from './creature.interface.js';

export interface HwMonster extends HwCreature {
  alignment: 'MONSTER';
  type: MonsterType | null;
}
