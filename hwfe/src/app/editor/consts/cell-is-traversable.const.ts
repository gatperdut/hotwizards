import { HwCell } from '@hw/shared/editor';
import { FloorSpritePath, FloorSpritePaths } from '@hw/shared/sprites';

export const cellIsTraversable = (
  cell: Pick<HwCell, 'baseSpritePath' | 'featureSpritePath' | 'secondary'>,
): boolean => {
  return (
    FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath) &&
    !cell.featureSpritePath &&
    !cell.secondary
  );
};
