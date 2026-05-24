import { HwCell } from './cells/cell.interface.js';
import { HwHero } from './creatures/heroes/hero.interface.js';
import { HwMonster } from './creatures/monsters/monster.interface.js';

export interface HwDungeon {
  cells: HwCell[];
  monsters: HwMonster[];
  heroes: HwHero[];
}
