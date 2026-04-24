import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class HwMembershipPartialDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  membershipId: number;
}
