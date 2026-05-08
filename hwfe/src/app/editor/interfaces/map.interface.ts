import { HwDungeon } from '@hw/shared';
import { HwCellPixi } from './cell.interface';

export interface HwDungeonPixi extends HwDungeon {
  cells: HwCellPixi[];
}
