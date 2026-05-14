import { HwCell } from '@hw/shared';
import { FloorSpritePath, FloorSpritePaths } from './sprite-paths/floor-sprite-paths.const';

export const cellIsTraversable = (
  cell: Pick<HwCell, 'baseSpritePath' | 'featureSpritePath' | 'secondary'>,
): boolean => {
  return (
    FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath) &&
    !cell.featureSpritePath &&
    !cell.secondary
  );
};
