import { Wizard } from '@hw/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello() {
    return { greeting: 'Hello World!' };
  }

  private user: Wizard | undefined;
}
