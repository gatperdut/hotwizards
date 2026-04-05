import { AppUser } from '@hw/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): { greeting: string } {
    return { greeting: 'Hello World!' };
  }

  public getError(): void {
    throw new Error('HWBE error');
  }

  private user: AppUser | undefined;
}
