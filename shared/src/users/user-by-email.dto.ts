import { IsEmail } from 'class-validator';

export class UserByEmailDto {
  @IsEmail({ require_tld: false })
  email!: string;
}
