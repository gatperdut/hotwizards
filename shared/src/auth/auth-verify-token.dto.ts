import { IsNotEmpty, IsString } from 'class-validator';

export class AuthVerifyTokenDto {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
