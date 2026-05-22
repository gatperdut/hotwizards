import { HwCell } from './cell.interface.js';
import { HwHero } from './hero.interface.js';
import { HwMonster } from './monster.interface.js';

export interface HwDungeon {
  cells: HwCell[];
  monsters: HwMonster[];
  heroes: HwHero[];
}
