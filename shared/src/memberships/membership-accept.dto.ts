import { Klass } from '@hw/prismagen/client';
import { HwCampaignPartialDto } from '@hw/shared';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HwMembershipAcceptDto extends HwCampaignPartialDto {
  @IsEnum(Klass)
  klass: Klass;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;
}
