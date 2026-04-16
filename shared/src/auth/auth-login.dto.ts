import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @Type(() => Boolean)
  rememberMe: boolean;
}
