import { Gender, Klass } from '@hw/prismagen/client';
import { HwCampaignPartialDto } from '@hw/shared';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HwMembershipAcceptDto extends HwCampaignPartialDto {
  @IsEnum(Klass)
  klass: Klass;

  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;
}
