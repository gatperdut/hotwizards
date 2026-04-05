import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('error')
export class ErrorController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getError(): void {
    return this.appService.getError();
  }
}
