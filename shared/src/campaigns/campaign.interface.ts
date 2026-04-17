export interface HwCampaign {
  id: number;
  name: string;
  masterId: number;
  memberIds: number[];
  membershipIds: number[];
  createdAt: Date;
}
