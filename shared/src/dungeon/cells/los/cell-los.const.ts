import { HwCell } from '../cell.interface.js';
import { cellAt } from '../position/cell-at.const.js';

export const cellLos = (cells: HwCell[], origin: HwCell, dest: HwCell): boolean => {
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

  while (true) {
    if (tMaxX < tMaxY) {
      x += sx;
      tMaxX += tDeltaX;
    } else if (tMaxX > tMaxY) {
      y += sy;
      tMaxY += tDeltaY;
    } else {
      if (!cellAt(cells, x + sx, y) || !cellAt(cells, x, y + sy)) {
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
    if (!cellAt(cells, x, y)) {
      return false;
    }
  }
};
