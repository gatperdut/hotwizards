import { HwDungeon } from '@hw/shared/dungeon';
import { HwfeCell } from './cell.interface';

export interface HwfeDungeon extends HwDungeon {
  cells: HwfeCell[];
}
