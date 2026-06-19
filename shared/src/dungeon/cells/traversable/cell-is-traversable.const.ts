import { FloorSpritePath, FloorSpritePaths } from '../../../sprites/floor-sprites.const.js';
import { HwCell } from '../cell.interface.js';

export const cellIsTraversable = <T extends HwCell>(cell: T): boolean => {
  return (
    FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath) &&
    !cell.creatureId &&
    !cell.stairsSpritePath &&
    !cell.feature.spritePath &&
    !cell.secondary &&
    (!cell.door.spritePath || cell.door.open)
  );
};
