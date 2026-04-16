import { Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail({ require_tld: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @Type(() => Boolean)
  rememberMe: boolean;
}
