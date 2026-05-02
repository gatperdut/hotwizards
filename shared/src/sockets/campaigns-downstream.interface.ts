export interface CampaignsDownstream {
  downCreateCampaign: (campaignId: number) => void;
  downDeleteCampaign: (campaignId: number) => void;
  downUpdateCampaign: (campaignId: number) => void;
  downStartAdventure: (campaignId: number, adventureTemplateName: string) => void;
  downFinishAdventure: (campaignId: number, adventureTemplateName: string) => void;
}
