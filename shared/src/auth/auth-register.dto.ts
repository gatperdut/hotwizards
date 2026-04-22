import { Match } from '@hw/shared';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class HwAuthRegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  handle: string;

  @IsNotEmpty()
  @IsEmail({ require_tld: false })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Match('password')
  passwordRepeat: string;
}
