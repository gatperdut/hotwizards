import { IsString } from 'class-validator';

export class UserAvailabilityHandleDto {
  @IsString()
  handle: string;
}
