import { HwEditorDungeon } from '@hw/shared/editor';
import { HwfeEditorCell } from './editor-cell.interface';

export interface HwfeEditorDungeon extends HwEditorDungeon {
  cells: HwfeEditorCell[];
}
