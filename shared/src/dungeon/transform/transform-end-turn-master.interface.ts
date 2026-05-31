import { HwMonster } from '../creatures/monsters/monster.interface.js';

export interface HwTransformEndTurnMaster {
  updatedMonsters: (Partial<HwMonster> & Pick<HwMonster, 'id'>)[];
}
