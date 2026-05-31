import { HwTransformEndTurnHero } from '../dungeon/transform/transform-end-turn-hero.interface.js';
import { HwTransformEndTurnMaster } from '../dungeon/transform/transform-end-turn-master.interface.js';
import { HwTransformMoveCreature } from '../dungeon/transform/transform-move-creature.interface.js';

export interface AdventuresDownstream {
  downFinishAdventure: () => void;
  downEndTurnMaster: (data: HwTransformEndTurnMaster) => void;
  downEndTurnHero: (data: HwTransformEndTurnHero) => void;
  downMoveHero: (data: HwTransformMoveCreature) => void;
  downMoveMonster: (data: HwTransformMoveCreature) => void;
  downSelectMonster: (id: number | null) => void;
}
