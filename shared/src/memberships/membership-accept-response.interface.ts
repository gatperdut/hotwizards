import { HwCharacter } from '../characters/character.interface.js';
import { HwMembership } from './membership.interface.js';

export interface HwMembershipAcceptResponse {
  membership: HwMembership;
  character: HwCharacter;
}
