import { Klass } from '@hw/prismagen/client';
import { HwCampaignPartialDto } from '@hw/shared';
import { IsEnum } from 'class-validator';

export class HwMembershipAcceptDto extends HwCampaignPartialDto {
  @IsEnum(Klass)
  klass: Klass;
}
