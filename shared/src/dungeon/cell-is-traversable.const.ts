import { FloorSpritePath, FloorSpritePaths } from '../sprites/floor-sprites.const.js';
import { HwCell } from './cells/cell.interface.js';

export const cellIsTraversable = (cell: HwCell): boolean => {
  return (
    FloorSpritePaths.includes(cell.baseSpritePath as FloorSpritePath) &&
    !cell.creatureId &&
    !cell.stairsSpritePath &&
    !cell.feature.spritePath &&
    !cell.secondary &&
    (!cell.door || cell.door.open)
  );
};
