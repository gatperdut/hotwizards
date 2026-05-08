import { Gender, Klass } from '@hw/prismagen/browser';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class HwMembershipAcceptDto {
  @IsEnum(Klass)
  klass: Klass;

  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;
}
