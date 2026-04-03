import { User } from '@hw/shared/users/user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Hello World!';
  }

  public user: User | undefined;
}
