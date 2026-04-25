import { Gender, Klass } from '@hw/prismagen/browser';
import { HwMe } from '../shared/me.interface.js';

export interface HwCharacter extends HwMe {
  id: number;
  name: string;
  gender: Gender;
  klass: Klass;
}
