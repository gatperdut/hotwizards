import { HwCell } from '../cell.interface.js';
import { cellAt } from '../position/cell-at.const.js';

export const cellsHaveLos = <T extends HwCell>(cells: T[], origin: T, dest: T): boolean => {
  if (origin.x === dest.x && origin.y === dest.y) {
    return true;
  }

  const dx = dest.x - origin.x;
  const dy = dest.y - origin.y;
  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  let x = origin.x;
  let y = origin.y;

  let tMaxX = ady;
  let tMaxY = adx;
  const tDeltaX = 2 * ady;
  const tDeltaY = 2 * adx;

  const blockedByDoor = (cell: T, cx: number, cy: number): boolean =>
    cell.door !== null && !cell.door.open && !(cx === dest.x && cy === dest.y);

  while (true) {
    if (tMaxX < tMaxY) {
      x += sx;
      tMaxX += tDeltaX;
    } else if (tMaxX > tMaxY) {
      y += sy;
      tMaxY += tDeltaY;
    } else {
      const nx = cellAt(cells, x + sx, y);
      const ny = cellAt(cells, x, y + sy);
      if (!nx || !ny) {
        return false;
      }
      if (blockedByDoor(nx, x + sx, y) || blockedByDoor(ny, x, y + sy)) {
        return false;
      }
      x += sx;
      y += sy;
      tMaxX += tDeltaX;
      tMaxY += tDeltaY;
    }

    if (x === dest.x && y === dest.y) {
      return true;
    }

    const cell = cellAt(cells, x, y);
    if (!cell) {
      return false;
    }
    if (blockedByDoor(cell, x, y)) {
      return false;
    }
  }
};
