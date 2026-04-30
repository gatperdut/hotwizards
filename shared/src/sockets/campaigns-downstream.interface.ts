export interface CampaignsDownstream {
  downCreateCampaign: (campaignId: number) => void;
  downDeleteCampaign: (campaignId: number) => void;
}
