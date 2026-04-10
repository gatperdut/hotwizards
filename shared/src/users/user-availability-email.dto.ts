import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserAvailabilityEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
