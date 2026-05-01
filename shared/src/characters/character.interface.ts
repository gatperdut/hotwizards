import { Gender, Klass } from '@hw/prismagen/browser';
import { HwMaster } from '../shared/master.interface.js';
import { HwMe } from '../shared/me.interface.js';

export interface HwCharacter extends HwMe, HwMaster {
  id: number;
  name: string;
  gender: Gender;
  klass: Klass;
}
