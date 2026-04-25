import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { HwCampaignCreateDto } from './campaign-create.dto.js';

export class HwCampaignUpdateDto extends HwCampaignCreateDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  campaignId: number;
}
