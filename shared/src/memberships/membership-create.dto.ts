import { HwCampaignPartialDto, ToArray } from '@hw/shared';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

export class HwMembershipCreateDto extends HwCampaignPartialDto {
  @ToArray()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];
}
