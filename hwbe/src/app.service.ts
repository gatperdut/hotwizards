import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { greeting: 'Hello World!' };
  }

  test() {
        const a = 'shadowfax';

    const b = 'djif';

    return a == 'shadowfax';
  }
}
