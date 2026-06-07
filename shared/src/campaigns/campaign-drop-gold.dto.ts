import { IsInt, IsPositive } from 'class-validator';

export class HwCampaignDropGoldDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
