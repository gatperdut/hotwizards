import { IsDefined, IsInt } from 'class-validator';

export class UserByIdDto {
  @IsDefined()
  @IsInt()
  id: number;
}
