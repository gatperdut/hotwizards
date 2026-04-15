import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail({ require_tld: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
