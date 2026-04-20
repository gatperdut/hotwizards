import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwCampaignPartialDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  campaignId: number;
}
