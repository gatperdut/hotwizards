import { Prisma, Ruleset } from '@hw/prismagen/client';
import { HwCampaign } from '@hw/shared';
import {
  AdventureHwRelations,
  adventureToHwAdventure,
} from '../adventures/adventure-to-hw-adventure.js';
import {
  MembershipHwRelations,
  membershipToHwMembership,
} from '../memberships/membership-to-hw-membership.js';
import { RulesetHwRelations, rulesetToHwRuleset } from '../rulesets/ruleset-to-hw-ruleset.js';
import { UserHwRelations, userToHwUser } from '../users/user-to-hw-user.js';

export const CampaignHwRelations = {
  include: {
    master: { ...UserHwRelations },
    memberships: {
      ...MembershipHwRelations,
    },
    ruleset: { ...RulesetHwRelations },
    adventure: {
      ...AdventureHwRelations,
    },
  },
} satisfies Prisma.CampaignDefaultArgs;

type CampaignWithHwRelations = Prisma.CampaignGetPayload<typeof CampaignHwRelations>;

export const campaignToHwCampaign = (
  campaign: CampaignWithHwRelations,
  userId: number,
): HwCampaign => {
  const ruleset = campaign.ruleset as Ruleset;

  return {
    id: campaign.id,
    name: campaign.name,
    createdAt: campaign.createdAt,
    master: userToHwUser(campaign.master, userId),
    memberships: campaign.memberships.map((membership) =>
      membershipToHwMembership(membership, userId),
    ),
    ruleset: rulesetToHwRuleset(ruleset),
    adventure: campaign.adventure ? adventureToHwAdventure(campaign.adventure) : undefined,
  };
};
