import { Gender, Klass } from '@hw/prismagen/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { HwMembershipPartialDto } from './membership-partial.dto.js';

export class HwMembershipAcceptDto extends HwMembershipPartialDto {
  @IsEnum(Klass)
  klass: Klass;

  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;
}
