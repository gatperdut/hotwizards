import { Prisma } from '@hw/prismagen/client';
import { HwInventory } from '@hw/shared/inventory';
import { HwMembership } from '@hw/shared/memberships';
import { userToHwUser } from '../users/user-to-hw-user.js';

export const MembershipHwRelations = {
  include: {
    user: true,
    character: true,
  },
  orderBy: { createdAt: 'asc' },
} satisfies Prisma.MembershipFindManyArgs;

type MembershipWithHwRelations = Prisma.MembershipGetPayload<typeof MembershipHwRelations>;

export const membershipToHwMembership = (
  membership: MembershipWithHwRelations,
  userId: number,
): HwMembership => {
  return {
    id: membership.id,
    campaignId: membership.campaignId,
    status: membership.status,
    createdAt: membership.createdAt,
    me: membership.userId === userId,
    user: userToHwUser(membership.user, userId),
    userId: membership.user.id,
    character: membership.character
      ? {
          ...membership.character,
          inventory: membership.character.inventory as unknown as HwInventory,
          me: membership.user.id === userId,
        }
      : undefined,
    characterId: membership.character?.id,
  };
};
