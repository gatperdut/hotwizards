import { Gender, Klass } from '@hw/prismagen/browser';
import { HeroSpritePath } from '../../../sprites/hero-sprites.const.js';
import { HwCreature } from '../../cells/creature.interface.js';

export interface HwHero extends HwCreature {
  alignment: 'HERO';
  spritePath: HeroSpritePath;
  membershipId: number;
  gender: Gender;
  klass: Klass;
  me: boolean;
}
