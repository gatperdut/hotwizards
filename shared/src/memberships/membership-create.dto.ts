import { HwOwnedCampaignDto, ToArray } from '@hw/shared';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

export class HwMembershipCreateDto extends HwOwnedCampaignDto {
  @ToArray()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  userIds: number[];
}
