import { Match } from '@hw/shared';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsString()
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
