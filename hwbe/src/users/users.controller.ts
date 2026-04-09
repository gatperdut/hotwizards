import { User } from '@hw/prismagen/client';
import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getUser(): Promise<User | null> {
    return this.appService.getUser();
  }
}
