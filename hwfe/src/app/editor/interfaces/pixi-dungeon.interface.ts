import { HwDungeon } from '@hw/shared';
import { HwPixiCell } from './pixi-cell.interface';

export interface HwPixiDungeon extends HwDungeon {
  cells: HwPixiCell[];
}
