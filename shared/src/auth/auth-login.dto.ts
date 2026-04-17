import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class HwAuthLoginDto {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @Type(() => Boolean)
  rememberMe: boolean;
}
