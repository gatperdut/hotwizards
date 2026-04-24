import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ToArray } from '../decorators/to-array.decorator.js';
import { PaginationDto } from '../pagination/pagination.dto.js';

export class HwUserSearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  term?: string;

  @IsOptional()
  @ToArray()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  excludeIds?: number[];
}
