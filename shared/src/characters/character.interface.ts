import { Gender, Klass } from '@hw/prismagen/browser';

export interface HwCharacter {
  id: number;
  membershipId: number;
  campaignId: number;
  name: string;
  gender: Gender;
  klass: Klass;
}
