import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwOwnedCampaignDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  campaignId: number;
}
