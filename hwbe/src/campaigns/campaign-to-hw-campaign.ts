import { Prisma, Ruleset } from '@hw/prismagen/client';
import { HwCampaign } from '@hw/shared';
import {
  MembershipHwRelations,
  membershipToHwMembership,
} from '../memberships/membership-to-hw-membership.js';

export const CampaignHwRelations = {
  include: {
    master: true,
    memberships: {
      ...MembershipHwRelations,
    },
    ruleset: true,
    adventure: {
      include: {
        template: true,
      },
    },
  },
} satisfies Prisma.CampaignDefaultArgs;

type CampaignWithHwRelations = Prisma.CampaignGetPayload<typeof CampaignHwRelations>;

export const campaignToHwCampaign = (
  campaign: CampaignWithHwRelations,
  userId: number,
): HwCampaign => {
  const ruleset = campaign.ruleset as Ruleset;

  const { password, ...strippedMaster } = campaign.master;

  return {
    id: campaign.id,
    name: campaign.name,
    createdAt: campaign.createdAt,
    master: {
      ...strippedMaster,
      me: campaign.masterId === userId,
    },
    memberships: campaign.memberships.map((membership) =>
      membershipToHwMembership(membership, userId),
    ),
    ruleset: {
      id: ruleset.id,
      aoo: ruleset.aoo,
      movement: ruleset.movement,
    },
    adventure: campaign.adventure
      ? {
          id: campaign.adventure.id,
          template: {
            id: campaign.adventure.template.id,
            name: campaign.adventure.template.name,
          },
          turn: campaign.adventure.turn,
        }
      : undefined,
  };
};
