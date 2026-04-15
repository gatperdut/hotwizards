import { Expose } from 'class-transformer';

export class PlayerDto {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  handle!: string;

  @Expose()
  admin!: boolean;
}
