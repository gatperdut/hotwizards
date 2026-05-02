import { MembershipStatus } from '@hw/prismagen/client';
import { HwCharacter } from '../characters/character.interface.js';
import { HwMe } from '../shared/me.interface.js';
import { HwUser } from '../users/user.interface.js';

export interface HwMembership extends HwMe {
  id: number;
  campaignId: number;
  status: MembershipStatus;
  joinedAt: Date;
  user: HwUser;
  character?: HwCharacter;
}
