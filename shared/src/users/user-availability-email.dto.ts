import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserAvailabilityEmailDto {
  @IsEmail({ require_tld: false })
  @IsNotEmpty()
  email: string;
}
