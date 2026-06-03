import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CharactersController } from './characters.controller.js';
import { CharactersGateway } from './characters.gateway.js';
import { CharactersService } from './characters.service.js';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, CharactersGateway],
  imports: [PrismaModule, AuthModule],
  exports: [],
})
export class CharactersModule {}
