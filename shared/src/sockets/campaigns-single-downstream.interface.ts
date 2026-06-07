export interface CampaignsSingleDownstream {
  downDeleteCampaign: () => void;
  downUpdateCampaign: () => void;
  downStartAdventure: () => void;
  downDropGold: (amount: number) => void;
}
