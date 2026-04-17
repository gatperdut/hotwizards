import { IsString } from 'class-validator';

export class HwUserAvailabilityHandleDto {
  @IsString()
  handle: string;
}
