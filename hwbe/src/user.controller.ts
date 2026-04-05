import { Controller, Get } from '@nestjs/common';
import { User } from 'generated/client.js';
import { AppService } from './app.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getUser(): Promise<User | null> {
    return this.appService.getUser();
  }
}
