import { cellAt } from './cell-at.const.js';
import { HwCell } from './cell.interface.js';

export const cellLos = (cells: HwCell[], origin: HwCell, dest: HwCell): boolean => {
  if (origin.x === dest.x && origin.y === dest.y) {
    return true;
  }

  const dx = Math.abs(dest.x - origin.x);
  const dy = Math.abs(dest.y - origin.y);
  const sx = origin.x < dest.x ? 1 : -1;
  const sy = origin.y < dest.y ? 1 : -1;

  let x = origin.x;
  let y = origin.y;
  let err = dx - dy;

  const e2start = 2 * err;
  if (e2start > 0) {
    x += sx;
    err -= dy;
  } else if (e2start < 0) {
    y += sy;
    err += dx;
  } else {
    x += sx;
    y += sy;
    err += dx - dy;
  }

  while (true) {
    if (x === dest.x && y === dest.y) {
      return true;
    }

    if (!cellAt(cells, x, y)) {
      return false;
    }

    const e2 = 2 * err;

    if (e2 === 0) {
      const cell1 = cellAt(cells, x + sx, y);
      const cell2 = cellAt(cells, x, y + sy);
      if (!cell1 || !cell2) {
        return false;
      }

      x += sx;
      y += sy;
      err += dx - dy;
    } else {
      if (e2 > 0) {
        x += sx;
        err -= dy;
      } else {
        y += sy;
        err += dx;
      }
    }
  }
};
