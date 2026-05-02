import { Prisma } from '@hw/prismagen/client';
import { HwMembership } from '@hw/shared';

export const MembershipHwRelations = {
  include: {
    user: true,
    character: true,
  },
} satisfies Prisma.MembershipDefaultArgs;

type MembershipWithHwRelations = Prisma.MembershipGetPayload<typeof MembershipHwRelations>;

export const membershipToHwMembership = (
  membership: MembershipWithHwRelations,
  userId: number,
): HwMembership => {
  const { password, ...strippedUser } = membership.user;

  return {
    id: membership.id,
    campaignId: membership.campaignId,
    status: membership.status,
    joinedAt: membership.joinedAt,
    me: membership.userId === userId,
    user: {
      ...strippedUser,
      me: membership.user.id === userId,
    },
    character: membership.character
      ? {
          ...membership.character,
          me: membership.user.id === userId,
        }
      : undefined,
  };
};
