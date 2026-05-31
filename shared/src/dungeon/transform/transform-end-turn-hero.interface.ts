import { HwHero } from '../creatures/heroes/hero.interface.js';

export interface HwTransformEndTurnHero {
  turn: number;
  updatedHero: Partial<HwHero> & Pick<HwHero, 'id'>;
}
