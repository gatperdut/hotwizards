export interface CampaignsDownstream {
  downCreateCampaign: (id: number) => void;
  downDeleteCampaign: (id: number) => void;
}
