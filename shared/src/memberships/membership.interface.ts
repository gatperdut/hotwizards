import { MembershipStatus } from '@hw/prismagen/client';
import { HwCharacter } from '../characters/character.interface.js';
import { HwMaster } from '../shared/master.interface.js';
import { HwMe } from '../shared/me.interface.js';
import { HwUser } from '../users/user.interface.js';

export interface HwMembership extends HwMe, HwMaster {
  id: number;
  status: MembershipStatus;
  joinedAt: Date;
  user: HwUser;
  character?: HwCharacter;
}
