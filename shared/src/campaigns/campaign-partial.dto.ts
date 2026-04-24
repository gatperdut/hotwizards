import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwCampaignPartialDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  campaignId: number;
}
