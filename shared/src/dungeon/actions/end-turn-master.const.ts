import { HwDungeon } from '../dungeon.interface.js';
import { HwTransformEndTurnMaster } from '../transform/transform-end-turn-master.interface.js';

export const endTurnMaster = (dungeon: HwDungeon, data: HwTransformEndTurnMaster): void => {
  dungeon.monsters = dungeon.monsters.map((m) => {
    return {
      ...m,
      actionPoints: data.monsters[m.id].actionPoints,
      movementPoints: data.monsters[m.id].movementPoints,
      maxMovementPoints: data.monsters[m.id].movementPoints,
    };
  });
};
