import { IsNotEmpty, IsString } from 'class-validator';

export class HwAuthVerifyTokenDto {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
