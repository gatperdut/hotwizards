export interface CampaignsAllDownstream {
  downCreateCampaign: (campaignId: number) => void;
  downDeleteCampaign: (campaignId: number) => void;
  downUpdateCampaign: (campaignId: number) => void;
}
