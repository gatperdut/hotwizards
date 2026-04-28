import { HwCampaign } from '../campaigns/campaign.interface.js';

export interface CampaignsDownstream {
  downCampaignCreate: (campaign: HwCampaign) => void;
  downCampaignDelete: (id: number) => void;
}
