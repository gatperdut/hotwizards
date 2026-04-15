import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  handle!: string;

  @IsNotEmpty()
  @IsEmail({ require_tld: false })
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsDefined()
  @IsBoolean()
  admin!: boolean;
}
