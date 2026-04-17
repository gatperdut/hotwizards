import { IsEmail, IsNotEmpty } from 'class-validator';

export class HwUserAvailabilityEmailDto {
  @IsEmail({ require_tld: false })
  @IsNotEmpty()
  email: string;
}
