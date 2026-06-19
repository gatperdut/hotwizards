import { HwTransformEndTurnHero } from '../dungeon/transform/transform-end-turn-hero.interface.js';
import { HwTransformEndTurnMaster } from '../dungeon/transform/transform-end-turn-master.interface.js';
import { HwTransformMoveHero } from '../dungeon/transform/transform-move-hero.interface.js';
import { HwTransformMoveMonster } from '../dungeon/transform/transform-move-monster.interface.js';
import { HwTransformOpenDoor } from '../dungeon/transform/transform-open-door.interface.js';
import { HwSlot } from '../inventory/slots.const.js';

export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downEndTurnMaster: (data: HwTransformEndTurnMaster) => void;
  downEndTurnHero: (data: HwTransformEndTurnHero) => void;
  downMoveHero: (data: HwTransformMoveHero) => void;
  downMoveMonster: (data: HwTransformMoveMonster) => void;
  downSelectMonster: (id: number | null) => void;
  downOpenDoor: (data: HwTransformOpenDoor) => void;
  downEquipItem: (heroId: number, backpackItemId: string) => void;
  downUnequipItem: (heroId: number, slot: HwSlot) => void;
  downDropItem: (heroId: number, backpackItemId: string) => void;
  downDestroyItem: (heroId: number, backpackItemId: string) => void;
  downPickupItem: (heroId: number, lootItemId: string) => void;
  downPickupGold: (heroId: number, amount: number) => void;
}
