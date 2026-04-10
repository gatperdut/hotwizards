import { IsNotEmpty, IsString } from 'class-validator';

export class AuthVerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}
