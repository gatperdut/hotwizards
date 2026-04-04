import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  public getHello(): { greeting: string } {
    return this.appService.getHello();
  }

  @Get('error')
  public getError(): void {
    return this.appService.getError();
  }
}
