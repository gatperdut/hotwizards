import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwMembershipPartialDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  membershipId: number;
}
