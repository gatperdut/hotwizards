import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';
import { ToArray } from '../decorators/to-array.decorator.js';

export class HwMembershipCreateDto {
  @ToArray()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  userIds: number[];
}
