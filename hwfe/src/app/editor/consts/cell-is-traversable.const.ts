import { HwCell } from '@hw/shared/editor';
import { FloorSpritePath, FloorSpritePaths } from '@hw/shared/sprites';

export const cellIsTraversable = (
  cell: Pick<HwCell, 'baseSpritePath' | 'secondary'> & {
    feature: Pick<HwCell['feature'], 'spritePath'>;
  },
): boolean => {
  return (
    FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath) &&
    !cell.feature.spritePath &&
    !cell.secondary
  );
};
