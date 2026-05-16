import { HwDungeon } from '@hw/shared/editor';
import { HwPixiCell } from './pixi-cell.interface';

export interface HwPixiDungeon extends HwDungeon {
  cells: HwPixiCell[];
}
