import { Prisma } from '@hw/prismagen/client';
import { HwMembership } from '@hw/shared';
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
          me: membership.user.id === userId,
        }
      : undefined,
    characterId: membership.character?.id,
  };
};
