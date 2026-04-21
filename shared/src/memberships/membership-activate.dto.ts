import { Klass } from '@hw/prismagen/client';
import { HwCampaignPartialDto } from '@hw/shared';
import { IsEnum } from 'class-validator';

export class HwMembershipActivateDto extends HwCampaignPartialDto {
  @IsEnum(Klass)
  klass: Klass;
}
