import { HwCharacter } from '@hw/shared';
import { HwMembership } from './membership.interface.js';

export interface HwMembershipAcceptResponse {
  membership: HwMembership;
  character: HwCharacter;
}
