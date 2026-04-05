import { Controller, Get } from '@nestjs/common';
import { User } from 'hwbe/generated/client';
import { AppService } from './app.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getUser(): Promise<User | null> {
    return this.appService.getUser();
  }
}
